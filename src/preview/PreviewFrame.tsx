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
          if (data.tokens) {
            setTokens(data.tokens);
            applyTokens(data.tokens, data.mode || mode);
          }
          if (data.mode) {
            setMode(data.mode);
            if (data.tokens) applyTokens(data.tokens, data.mode);
          }
          break;
        }

        case 'TOKENS': {
          if (data.tokens) {
            setTokens(data.tokens);
            if (data.tokens.meta?.genreId) {
              setGenreId(data.tokens.meta.genreId);
            }
            // Throttle with rAF
            requestAnimationFrame(() => {
              applyTokens(data.tokens, mode);
            });

            // Run audit and send back to studio
            const semantic = data.tokens.color.semantic[mode];
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

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <TemplateComponent
        brandName={tokens.meta?.projectName || genre.label}
        heroImage={genre.heroImage}
      />
    </div>
  );
};

export default PreviewFrame;

