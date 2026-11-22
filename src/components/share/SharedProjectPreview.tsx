import React, { useState, useMemo } from 'react';
import { Sparkles, Download, Edit3, ArrowRight } from 'lucide-react';
import { DesignTokens } from '../../tokens/types';
import { LiveWebsitePreview } from '../preview/LiveWebsitePreview';
import { exportStarterZip } from '../../utils/tokenExporters';
import { createNewProject } from '../../data/sampleProjects';
import { DesignProject } from '../../types/designSystem';

interface SharedProjectPreviewProps {
  tokens: DesignTokens;
  onForkAndEdit: () => void;
}

export const SharedProjectPreview: React.FC<SharedProjectPreviewProps> = ({
  tokens,
  onForkAndEdit
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const projectName = tokens.meta.projectName || 'Shared Design System';
  const headingFont = tokens.typography.roles.heading?.family || 'System';
  const bodyFont = tokens.typography.roles.body?.family || 'System';

  const mockProject: DesignProject = useMemo(() => {
    const base = createNewProject(tokens.meta.projectName || 'Shared System');
    return {
      ...base,
      name: tokens.meta.projectName || 'Shared System',
      tokens
    };
  }, [tokens]);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      const blob = await exportStarterZip(tokens);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tokens.meta.slug || 'design_system'}_starter.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export starter zip:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 text-white min-h-[calc(100vh-64px)]">
      {/* Top Banner */}
      <div className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono font-bold">
              Read-Only Share
            </span>
            <h1 className="text-lg font-bold tracking-tight text-white">{projectName}</h1>
          </div>
          <p className="text-xs text-neutral-400">
            Fonts: <span className="text-neutral-200 font-semibold">{headingFont}</span> +{' '}
            <span className="text-neutral-200 font-semibold">{bodyFont}</span> · Primary Tone:{' '}
            <span
              className="inline-block w-3 h-3 rounded-full align-middle ml-1 border border-white/20"
              style={{ backgroundColor: tokens.color.semantic.light.actionPrimary }}
            />
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadZip}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Packaging...' : 'Download Starter'}</span>
          </button>

          <button
            onClick={onForkAndEdit}
            className="px-4 py-1.5 rounded-lg bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Fork & Edit in Studio</span>
            <ArrowRight className="w-3 h-3 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Interactive Preview Canvas */}
      <div className="flex-1 p-4 md:p-6 flex items-center justify-center overflow-auto bg-neutral-900/60">
        <div className="h-full w-full max-w-7xl">
          <div className="h-full min-h-[700px] rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-950">
            <LiveWebsitePreview project={mockProject} isEmbedded={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
