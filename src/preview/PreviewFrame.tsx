import React, { useEffect, useState, useRef } from 'react';
import { DesignTokens, CategoryId } from '../tokens/types';
import { DEFAULT_DESIGN_TOKENS } from '../tokens/defaultTokens';
import { applyTokens } from './tokens/applyTokens';
import { TEMPLATE_REGISTRY } from './templates';
import { getGenreById } from './genres';
import { auditSemanticContrast } from '../tokens/contrastEngine';

export const PreviewFrame: React.FC = () => {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_DESIGN_TOKENS);
  const [genreId, setGenreId] = useState<string>('ceramics-atelier');
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

  const genre = getGenreById(genreId || tokens.meta?.genreId || 'ceramics-atelier');
  const category: CategoryId = genre.category || 'commerce';
  const TemplateComponent = TEMPLATE_REGISTRY[category] || TEMPLATE_REGISTRY.commerce;

  const brandName = projectMeta.business?.name || projectMeta.name || tokens.meta?.projectName || genre.label;
  const headline = projectMeta.business?.offering || projectMeta.business?.primaryGoal || genre.description;
  const subtitle = projectMeta.business?.audience
    ? `Crafted for ${projectMeta.business.audience}. ${projectMeta.business.primaryGoal ? projectMeta.business.primaryGoal + '.' : ''}`
    : undefined;
  const badge = projectMeta.visualDirection?.archetype || genre.label;

  // RTL Internationalization Detection (Doc 04 §Internationalization)
  const isRtl = Boolean(
    (tokens.meta as any)?.direction === 'rtl' ||
    tokens.meta?.scripts?.some(s => ['arabic', 'hebrew', 'farsi', 'urdu', 'ar', 'he'].includes(s.toLowerCase()))
  );

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = isRtl ? 'ar' : 'en';
  }, [isRtl]);

  return (
    <div className="w-full min-h-screen overflow-x-hidden" dir={isRtl ? 'rtl' : 'ltr'}>
      <TemplateComponent
        brandName={brandName}
        headline={headline}
        subtitle={subtitle}
        badge={badge}
        heroImage={genre.heroImage}
        components={projectMeta.components}
        buttonStyle={projectMeta.components?.buttonStyle || tokens.component?.buttonStyle}
      />
    </div>
  );
};

export default PreviewFrame;

