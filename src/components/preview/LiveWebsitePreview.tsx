import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ExternalLink
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface LiveWebsitePreviewProps {
  project: DesignProject;
  initialViewport?: 'mobile' | 'tablet' | 'desktop';
  isEmbedded?: boolean;
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({
  project,
  initialViewport = 'desktop',
  isEmbedded = false
}) => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>(initialViewport);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    project.accessibility.defaultTheme === 'dark' ? 'dark' : 'light'
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isIframeReady = useRef(false);

  const sendToPreview = useCallback((message: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(message, window.location.origin);
    }
  }, []);

  const initPreview = useCallback(() => {
    sendToPreview({
      type: 'INIT',
      genreId: project.websiteType?.id || project.tokens?.meta?.genreId || 'ceramics-atelier',
      tokens: project.tokens,
      mode: themeMode,
      project: {
        name: project.name || project.tokens?.meta?.projectName,
        business: project.business,
        websiteType: project.websiteType,
        visualDirection: project.visualDirection,
        components: project.components,
        imagery: project.imagery,
        category: project.websiteType?.category || project.tokens?.meta?.category || 'commerce'
      }
    });
  }, [project, themeMode, sendToPreview]);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === 'READY') {
        isIframeReady.current = true;
        initPreview();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [initPreview]);

  // Sync tokens or theme mode changes
  useEffect(() => {
    if (isIframeReady.current) {
      sendToPreview({
        type: 'TOKENS',
        tokens: project.tokens,
        genreId: project.websiteType?.id || project.tokens?.meta?.genreId || 'ceramics-atelier',
        mode: themeMode,
        project: {
          name: project.name || project.tokens?.meta?.projectName,
          business: project.business,
          websiteType: project.websiteType,
          visualDirection: project.visualDirection,
          components: project.components,
          imagery: project.imagery,
          category: project.websiteType?.category || project.tokens?.meta?.category || 'commerce'
        }
      });
    }
  }, [project, themeMode, sendToPreview]);

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px]';
      case 'tablet':
        return 'w-[768px]';
      case 'desktop':
      default:
        return 'w-full';
    }
  };

  return (
    <div
      className={`flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50' : 'w-full h-full min-h-[500px]'
      }`}
    >
      {/* Top Preview Controls Toolbar */}
      {!isEmbedded && (
        <div className="px-4 py-2.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-4 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-neutral-300">
              {project.websiteType?.name || project.name}
            </span>
            <span className="text-neutral-600 font-mono text-[10px] hidden sm:inline">
              ({project.tokens?.meta?.genreId || 'ceramics-atelier'})
            </span>
          </div>

          {/* Viewport switchers */}
          <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-lg border border-neutral-800" role="toolbar" aria-label="Viewport controls">
            <button
              type="button"
              onClick={() => setViewport('desktop')}
              aria-label="Desktop View (100%)"
              aria-pressed={viewport === 'desktop'}
              className={`p-1.5 rounded transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center ${
                viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Desktop View (100%)"
            >
              <Monitor className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('tablet')}
              aria-label="Tablet View (768px)"
              aria-pressed={viewport === 'tablet'}
              className={`p-1.5 rounded transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center ${
                viewport === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setViewport('mobile')}
              aria-label="Mobile View (375px)"
              aria-pressed={viewport === 'mobile'}
              className={`p-1.5 rounded transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center ${
                viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Theme & Fullscreen controls */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'))}
              aria-label={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} theme`}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-300 hover:text-white transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
              title={`Switch to ${themeMode === 'light' ? 'Dark' : 'Light'} theme`}
            >
              {themeMode === 'light' ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" aria-hidden="true" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(prev => !prev)}
              aria-label={isFullscreen ? 'Exit fullscreen preview' : 'Enter fullscreen preview'}
              className="p-1.5 rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white transition-colors cursor-pointer min-w-[28px] min-h-[28px] flex items-center justify-center"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen preview'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" /> : <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />}
            </button>
          </div>
        </div>
      )}

      {/* Frame Container */}
      <div className="flex-1 min-h-0 bg-neutral-950/80 flex items-center justify-center p-2 relative overflow-hidden">
        <div
          className={`h-full transition-all duration-300 relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800 bg-white ${getViewportWidth()}`}
        >
          <iframe
            ref={iframeRef}
            src="/preview-frame"
            title="Live website preview"
            aria-label="Interactive live website preview"
            className="w-full h-full border-0"
            onLoad={() => {
              isIframeReady.current = true;
              initPreview();
            }}
          />
        </div>
      </div>
    </div>
  );
};
