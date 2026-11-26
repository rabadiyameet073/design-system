import React, { useEffect, useState, useRef } from 'react';
import { DesignTokens, CategoryId } from '../tokens/types';
import { DEFAULT_DESIGN_TOKENS } from '../tokens/defaultTokens';
import { applyTokens } from './tokens/applyTokens';
import { TEMPLATE_REGISTRY } from './templates';
import { getGenreById, GENRE_CONFIGS } from './genres';
import { resolveGenreContent } from './genres/genreContent';
import { auditSemanticContrast } from '../tokens/contrastEngine';
import { localizeGenreContent, getScriptMeta } from './i18n/localizeContent';
import { Globe } from 'lucide-react';

export const PreviewFrame: React.FC = () => {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const [genreId, setGenreId] = useState<string>('');
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [projectMeta, setProjectMeta] = useState<any>({});
  const [isReady, setIsReady] = useState(false);

  // Apply initial tokens on load
  useEffect(() => {
    applyTokens(tokens, mode);
    setIsReady(true);

    // Notify parent studio window that iframe is ready
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'READY' }, window.location.origin);
    }
  }, []);

  // Handle incoming postMessages from studio
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin: accept same-origin
      if (event.origin !== window.location.origin) {
        return;
      }

      const data = event.data;
      if (!data || typeof data !== 'object') return;

      switch (data.type) {
        case 'INIT': {
          if (data.genreId) setGenreId(data.genreId);
          if (data.project) setProjectMeta(data.project);
          const activeMode = data.mode || mode;
          if (data.mode) setMode(activeMode);
          if (data.tokens) {
            setTokens(data.tokens);
            if (data.tokens.meta?.activeScript) {
              setActiveScriptOverride(null);
            }
            applyTokens(data.tokens, activeMode);

            const semantic = data.tokens.color?.semantic?.[activeMode] || data.tokens.color?.semantic?.light;
            if (semantic) {
              const audit = auditSemanticContrast(semantic);
              if (window.parent && window.parent !== window) {
                window.parent.postMessage(
                  {
                    type: 'A11Y_RESULT',
                    pass: audit.passCount,
                    fail: audit.failCount,
                    issues: audit.issues
                  },
                  window.location.origin
                );
              }
            }
          }
          break;
        }

        case 'TOKENS': {
          if (data.project) {
            setProjectMeta(data.project);
          }
          if (data.tokens) {
            setTokens(data.tokens);
            if (data.tokens.meta?.activeScript) {
              setActiveScriptOverride(null);
            }
            const nextGenre = data.genreId || data.tokens.meta?.genreId;
            if (nextGenre) {
              setGenreId(nextGenre);
            }
            const activeMode = data.mode || mode;
            // Throttle with rAF
            requestAnimationFrame(() => {
              applyTokens(data.tokens, activeMode);
            });

            // Run audit and send back to studio
            const semantic = data.tokens.color?.semantic?.[activeMode] || data.tokens.color?.semantic?.light;
            if (semantic) {
              const audit = auditSemanticContrast(semantic);
              if (window.parent && window.parent !== window) {
                window.parent.postMessage(
                  {
                    type: 'A11Y_RESULT',
                    pass: audit.passCount,
                    fail: audit.failCount,
                    issues: audit.issues
                  },
                  window.location.origin
                );
              }
            }
          }
          break;
        }

        case 'MODE': {
          const nextMode = data.mode === 'dark' ? 'dark' : 'light';
          setMode(nextMode);
          applyTokens(tokens, nextMode);

          // Update audit for new mode
          const audit = auditSemanticContrast(tokens.color.semantic[nextMode]);
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                type: 'A11Y_RESULT',
                pass: audit.passCount,
                fail: audit.failCount,
                issues: audit.issues
              },
              window.location.origin
            );
          }
          break;
        }

        case 'SCROLL_TO': {
          if (data.sectionId) {
            let el = document.getElementById(data.sectionId);
            if (!el) {
              const aliases: Record<string, string> = {
                'components': 'components-showcase',
                'components-showcase': 'components-showcase',
                'type': 'type-specimen',
                'type-specimen': 'type-specimen',
                'pricing': 'pricing',
                'pricing-table': 'pricing',
                'features': 'features',
                'feature-grid': 'features',
                'products': 'products',
                'product-grid': 'products',
                'booking': 'booking',
                'booking-widget': 'booking',
                'courses': 'courses',
                'course-cards': 'courses',
                'projects': 'projects',
                'project-grid': 'projects',
                'gallery': 'gallery',
                'hero': 'hero'
              };
              const resolved = aliases[data.sectionId];
              if (resolved) el = document.getElementById(resolved);
            }
            if (!el && data.sectionId !== 'hero') {
              el = document.getElementById('hero');
            }
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }
          break;
        }

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tokens, mode]);

  // 1. Determine active genre ID candidate from most explicit current inputs
  const genreCandidate = (
    projectMeta.websiteType?.id ||
    genreId ||
    tokens.meta?.genreId ||
    ''
  ).toString().trim();

  const candidateGenreObj = genreCandidate ? getGenreById(genreCandidate) : null;

  // 2. Determine active category candidate: projectMeta category/websiteType take top priority
  const rawCatCandidate = (
    projectMeta.category ||
    projectMeta.websiteType?.category ||
    (candidateGenreObj?.category) ||
    tokens.meta?.category ||
    genreCandidate ||
    ''
  ).toString().toLowerCase().trim();

  let matchedCategory: CategoryId | null = null;
  if (rawCatCandidate in TEMPLATE_REGISTRY) {
    matchedCategory = rawCatCandidate as CategoryId;
  } else if (candidateGenreObj && candidateGenreObj.category in TEMPLATE_REGISTRY) {
    matchedCategory = candidateGenreObj.category;
  } else {
    for (const catKey of Object.keys(TEMPLATE_REGISTRY) as CategoryId[]) {
      if (rawCatCandidate.includes(catKey)) {
        matchedCategory = catKey;
        break;
      }
    }
  }

  // 3. Resolve Genre (ensuring genre belongs to matched category if matchedCategory exists)
  const resolvedGenreId = (
    (genreCandidate && (!matchedCategory || candidateGenreObj?.category === matchedCategory) ? genreCandidate : '') ||
    (matchedCategory ? Object.values(GENRE_CONFIGS).find(g => g.category === matchedCategory)?.id : '') ||
    'ceramics-atelier'
  );

  const genre = getGenreById(resolvedGenreId);
  const category: CategoryId = matchedCategory || genre.category || 'commerce';
  const TemplateComponent = TEMPLATE_REGISTRY[category] || TEMPLATE_REGISTRY.commerce;

  // 3. Resolve genre content. Explicit project metadata wins over genre defaults.
  //    Every genre (not just its category) now contributes brand, copy and items.
  const isSampleCeramicsName = (n?: string) =>
    n === 'Ceramics Atelier' || n === 'Komorebi Ceramics' || n === 'Komorebi Studio & Ceramics';

  const isGenericDefault = (n?: string) =>
    !n ||
    n === 'My New Website' ||
    n === 'Untitled Project' ||
    n === 'New Design System' ||
    // Preset/wizard sample residue must not override a different genre's brand.
    (isSampleCeramicsName(n) && resolvedGenreId !== 'ceramics-atelier');

  const customName =
    (!isGenericDefault(projectMeta.business?.name) ? projectMeta.business?.name : null) ||
    (!isGenericDefault(projectMeta.name) ? projectMeta.name : null) ||
    (!isGenericDefault(tokens.meta?.projectName) ? tokens.meta?.projectName : null);

  const isSamplePotteryOffering =
    projectMeta.business?.offering?.includes('Hand-thrown stoneware') ||
    projectMeta.business?.offering?.includes('tactile tea sets');

  const customHeadline = (projectMeta.business?.offering && (!isSamplePotteryOffering || resolvedGenreId === 'ceramics-atelier'))
    ? projectMeta.business.offering
    : undefined;

  const customSubtitle = (projectMeta.business?.audience && (!isSamplePotteryOffering || resolvedGenreId === 'ceramics-atelier'))
    ? `Crafted for ${projectMeta.business.audience}.`
    : undefined;

  const content = resolveGenreContent(resolvedGenreId, {
    brandName: customName || undefined,
    headline: customHeadline || undefined,
    subtitle: customSubtitle || undefined,
    badge: projectMeta.visualDirection?.archetype || projectMeta.visualDirection?.name || undefined
  });

  // Multi-script & Writing System Detection (Gujarati, Devanagari, Arabic, Cyrillic, Latin)
  const selectedScripts: string[] = tokens.meta?.scripts || ['latin'];
  const [activeScriptOverride, setActiveScriptOverride] = useState<string | null>(null);

  const activeScript = (
    activeScriptOverride ||
    tokens.meta?.activeScript ||
    selectedScripts.find(s => s.toLowerCase() !== 'latin') ||
    selectedScripts[0] ||
    'latin'
  ).toLowerCase();

  const localizedContent = localizeGenreContent(
    content,
    activeScript,
    category,
    customName
  );

  const { brandName, headline, subtitle, badge, scriptMeta } = localizedContent;
  const isRtl = scriptMeta.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = scriptMeta.dir;
    document.documentElement.lang = scriptMeta.lang;

    // Dynamically apply native typography for non-latin scripts
    if (activeScript !== 'latin' && scriptMeta.fonts) {
      document.documentElement.style.setProperty('--font-display', `"${scriptMeta.fonts.display}", serif`);
      document.documentElement.style.setProperty('--font-heading', `"${scriptMeta.fonts.heading}", sans-serif`);
      document.documentElement.style.setProperty('--font-body', `"${scriptMeta.fonts.body}", sans-serif`);
    } else {
      document.documentElement.style.removeProperty('--font-display');
      document.documentElement.style.removeProperty('--font-heading');
      document.documentElement.style.removeProperty('--font-body');
    }

    // Ensure Google Fonts for the active script are loaded in preview iframe
    applyTokens({
      ...tokens,
      meta: {
        ...tokens.meta,
        activeScript
      }
    }, mode);
  }, [scriptMeta, activeScript, tokens, mode]);

  const effectiveComponents = {
    ...tokens.component,
    ...projectMeta.components,
    buttonStyle: projectMeta.components?.buttonStyle || tokens.component?.buttonStyle,
    cardStyle: projectMeta.components?.cardStyle || (tokens.component as any)?.cardStyle,
    enabledComponents: projectMeta.components?.enabledComponents || (tokens.component as any)?.enabledComponents
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden relative" dir={scriptMeta.dir}>
      {/* Floating Language Script Switcher Pill when multi-script is configured */}
      {selectedScripts.length > 1 && (
        <aside
          aria-label="Language script switcher"
          className="fixed top-3 right-4 z-50 flex items-center gap-1.5 p-1 rounded-full bg-white/95 dark:bg-neutral-900/95 border border-neutral-300/80 dark:border-neutral-700 shadow-lg backdrop-blur-md text-[11px] font-bold"
        >
          <Globe className="w-3.5 h-3.5 ml-1.5 text-neutral-600 dark:text-neutral-400" />
          {selectedScripts.map((s) => {
            const meta = getScriptMeta(s);
            const isActive = activeScript === s.toLowerCase();
            return (
              <button
                key={s}
                type="button"
                onClick={() => setActiveScriptOverride(s.toLowerCase())}
                className={`px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-2xs font-bold'
                    : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900'
                }`}
              >
                {meta.nativeLabel || s}
              </button>
            );
          })}
        </aside>
      )}

      <TemplateComponent
        content={localizedContent}
        brandName={brandName}
        headline={headline}
        subtitle={subtitle}
        badge={badge}
        heroImage={localizedContent.heroImage}
        genreId={resolvedGenreId}
        components={effectiveComponents}
        buttonStyle={effectiveComponents.buttonStyle}
      />
    </div>
  );
};

export default PreviewFrame;

