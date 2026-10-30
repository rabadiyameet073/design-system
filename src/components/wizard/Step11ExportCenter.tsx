import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Package,
  FileCode,
  Layers,
  Code2,
  FileText,
  Image,
  ExternalLink,
  Upload
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DesignProject } from '../../types/designSystem';
import {
  exportTailwind4,
  exportCssVars,
  exportDtcgJson,
  exportTypeScript,
  exportShadcn,
  exportFigmaTokensStudio,
  exportProjectJson,
  exportStarterZip
} from '../../utils/tokenExporters';
import { generateDesignSystemPdf, downloadVisualBoardPng } from '../../utils/exportGenerators';

interface Step11ExportCenterProps {
  project: DesignProject;
  onChange?: (updated: Partial<DesignProject>) => void;
}

export const Step11ExportCenter: React.FC<Step11ExportCenterProps> = ({ project, onChange }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'code' | 'assets'>('all');
  const [isPackaging, setIsPackaging] = useState(false);

  const tokens = project.tokens;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = (filename: string, content: string, mime = 'text/plain') => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadStarterZip = async () => {
    setIsPackaging(true);
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

      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error generating starter zip:', err);
    } finally {
      setIsPackaging(false);
    }
  };

  const exportFormats = [
    {
      id: 'tailwind4',
      title: 'Tailwind CSS 4 Theme',
      filename: 'theme.css',
      category: 'code',
      badge: 'Modern Vite / Next.js',
      description: '@theme inline block with automatic OKLCH custom variant dark mappings.',
      getContent: () => exportTailwind4(tokens)
    },
    {
      id: 'css-vars',
      title: 'CSS Custom Properties',
      filename: 'tokens.css',
      category: 'code',
      badge: ':root & .dark',
      description: 'Zero runtime dependencies. Pure CSS variables for any framework.',
      getContent: () => exportCssVars(tokens)
    },
    {
      id: 'dtcg-json',
      title: 'W3C Design Tokens (DTCG)',
      filename: 'tokens.json',
      category: 'code',
      badge: 'W3C Community Spec',
      description: 'Standard token structure with $type, $value, and aliases for Style Dictionary.',
      getContent: () => exportDtcgJson(tokens)
    },
    {
      id: 'typescript',
      title: 'TypeScript Definitions',
      filename: 'tokens.ts',
      category: 'code',
      badge: 'Type-Safe as const',
      description: 'Immutable constant tokens with strict exported types for React & Node.',
      getContent: () => exportTypeScript(tokens)
    },
    {
      id: 'shadcn',
      title: 'shadcn/ui Theme Block',
      filename: 'shadcn-theme.css',
      category: 'code',
      badge: '@layer base',
      description: 'Maps semantic tokens to --primary, --background, --radius, and --ring.',
      getContent: () => exportShadcn(tokens)
    },
    {
      id: 'figma-tokens',
      title: 'Figma Tokens Studio',
      filename: 'tokens.studio.json',
      category: 'code',
      badge: 'Figma Plugin Ready',
      description: 'Import directly into the Tokens Studio plugin in Figma with zero drift.',
      getContent: () => exportFigmaTokensStudio(tokens)
    },
    {
      id: 'project-json',
      title: 'Project State (DSS v1)',
      filename: 'project.dss.json',
      category: 'code',
      badge: 'schemaVersion: 1',
      description: 'Full design system state that can be re-imported into Design System Studio.',
      getContent: () => exportProjectJson(tokens)
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 11 of 11 · Production Export Center</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Export your single source of truth design system
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          All design decisions are compiled into production-ready formats. Download individual files or grab the complete starter ZIP with self-hosted font installation packages.
        </p>
      </div>

      {/* Hero Download Starter ZIP Banner */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-neutral-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-amber-400 font-bold">
            <Package className="w-4 h-4" />
            <span>Complete Developer Package</span>
          </div>
          <h2 className="text-xl font-bold">Download All Deliverables (Starter ZIP)</h2>
          <p className="text-xs text-neutral-400 max-w-md">
            Includes all 7 code token formats, self-hosted font install instructions (OFL licensed), sample components, and README.
          </p>
        </div>

        <button
          onClick={handleDownloadStarterZip}
          disabled={isPackaging}
          className="self-start sm:self-auto px-6 py-3 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center gap-2 hover:bg-neutral-100 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{isPackaging ? 'Packaging ZIP...' : 'Download Starter ZIP'}</span>
        </button>
      </div>

      {/* Visual Deliverables: PDF & PNG */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          Visual Assets & Specifications
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PDF Spec */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-sm text-neutral-900">4-Page PDF Specification</h3>
              </div>
              <p className="text-xs text-neutral-500">
                Vector document with computed OKLCH color ramps, WCAG 2.2 AA contrast audits, and typographic ladders.
              </p>
            </div>
            <button
              onClick={() => {
                generateDesignSystemPdf(project);
                confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
              }}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer shrink-0"
            >
              Download PDF
            </button>
          </div>

          {/* PNG Board */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-sm text-neutral-900">Specimen Board (1600×1000)</h3>
              </div>
              <p className="text-xs text-neutral-500">
                High-resolution canvas specimen board displaying palette swatches, type scales, and component cards.
              </p>
            </div>
            <button
              onClick={() => downloadVisualBoardPng(project)}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer shrink-0"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>

      {/* Code Token Formats List */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          Code Token Packages & Theme Bindings
        </div>

        <div className="space-y-3">
          {exportFormats.map(fmt => {
            const isCopied = copiedKey === fmt.id;
            const content = fmt.getContent();

            return (
              <div
                key={fmt.id}
                className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-neutral-900">{fmt.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {fmt.filename}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                      {fmt.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 truncate max-w-xl">
                    {fmt.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => handleCopy(fmt.id, content)}
                    className="px-3 py-1.5 text-xs font-semibold border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-all flex items-center gap-1.5 cursor-pointer text-neutral-700"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-neutral-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => downloadFile(fmt.filename, content)}
                    className="px-3 py-1.5 text-xs font-semibold bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
