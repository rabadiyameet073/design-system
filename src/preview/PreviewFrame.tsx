import React, { useEffect, useState, useRef } from 'react';
import { DesignTokens, CategoryId } from '../tokens/types';
import { DEFAULT_DESIGN_TOKENS } from '../tokens/defaultTokens';
import { applyTokens } from './tokens/applyTokens';
import { TEMPLATE_REGISTRY } from './templates';
import { getGenreById, GENRE_CONFIGS } from './genres';
import { resolveGenreContent } from './genres/genreContent';
import { auditSemanticContrast } from '../tokens/contrastEngine';

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
          if (data.mode) setMode(data.mode);
          if (data.tokens) {
            setTokens(data.tokens);
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

  const { brandName, headline, subtitle, badge } = content;

  // RTL Internationalization Detection (Doc 04 §Internationalization)
  const isRtl = Boolean(
    (tokens.meta as any)?.direction === 'rtl' ||
    tokens.meta?.scripts?.some(s => ['arabic', 'hebrew', 'farsi', 'urdu', 'ar', 'he'].includes(s.toLowerCase()))
  );

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : 'en';
  }, [isRtl]);

  const effectiveComponents = {
    ...tokens.component,
    ...projectMeta.components,
    buttonStyle: projectMeta.components?.buttonStyle || tokens.component?.buttonStyle,
    cardStyle: projectMeta.components?.cardStyle || (tokens.component as any)?.cardStyle,
    enabledComponents: projectMeta.components?.enabledComponents || (tokens.component as any)?.enabledComponents
  };

  return (
    <div className="w-full min-h-screen overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <TemplateComponent
        content={content}
        brandName={brandName}
        headline={headline}
        subtitle={subtitle}
        badge={badge}
        heroImage={content.heroImage}
        genreId={resolvedGenreId}
        components={effectiveComponents}
        buttonStyle={effectiveComponents.buttonStyle}
      />
    </div>
  );
};

export default PreviewFrame;

