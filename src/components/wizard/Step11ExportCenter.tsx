import React, { useState, useMemo } from 'react';
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
  Upload,
  FolderTree,
  File,
  Folder,
  Terminal,
  Play,
  AlertTriangle,
  Wand2,
  Share2,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DesignProject } from '../../types/designSystem';
import { DesignTokens } from '../../tokens/types';
import {
  exportTailwind4,
  exportTailwind3,
  exportCssVars,
  exportScss,
  exportDtcgJson,
  exportTypeScript,
  exportShadcn,
  exportFigmaTokensStudio,
  exportFigmaVariables,
  exportStyleDictionaryConfig,
  exportSelfHostedFonts,
  exportA11yAuditReport,
  exportProjectJson,
  exportStarterZip
} from '../../utils/tokenExporters';
import { generateDesignSystemPdf, downloadVisualBoardPng } from '../../utils/exportGenerators';
import { auditSemanticContrast, autoFixSemantic } from '../../tokens/contrastEngine';
import { createShareableUrl } from '../../utils/router';
import { trackEvent } from '../../utils/telemetry';

interface Step11ExportCenterProps {
  project: DesignProject;
  onChange?: (updated: Partial<DesignProject>) => void;
}

export const Step11ExportCenter: React.FC<Step11ExportCenterProps> = ({ project, onChange }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'code' | 'assets'>('all');
  const [isPackaging, setIsPackaging] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);
  const [selectedTreeFile, setSelectedTreeFile] = useState<string>('src/styles/theme.css');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const tokens = project.tokens;
  const projectSlug = tokens.meta.slug || 'design_system';

  // Real-time Pre-Export Contrast Audit Gate (Doc 05 §Export Improvements #5)
  const lightAudit = useMemo(() => auditSemanticContrast(tokens.color.semantic.light), [tokens.color.semantic.light]);
  const darkAudit = useMemo(() => auditSemanticContrast(tokens.color.semantic.dark), [tokens.color.semantic.dark]);

  const failingIssues = useMemo(() => {
    const list: Array<{ name: string; mode: 'light' | 'dark'; ratio: number; targetRatio: number }> = [];
    lightAudit.issues.forEach(i => {
      if (!i.passed) list.push({ name: i.name, mode: 'light', ratio: i.ratio, targetRatio: i.targetRatio });
    });
    darkAudit.issues.forEach(i => {
      if (!i.passed) list.push({ name: i.name, mode: 'dark', ratio: i.ratio, targetRatio: i.targetRatio });
    });
    return list;
  }, [lightAudit, darkAudit]);

  const hasFailingContrast = failingIssues.length > 0;

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    trackEvent('export_copied', { format: key });
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCopyShareLink = () => {
    const url = createShareableUrl(tokens);
    navigator.clipboard.writeText(url);
    setCopiedKey('share-link');
    setStatusMessage('Shareable hosted preview URL copied to clipboard!');
    trackEvent('shareable_url_created', { projectName: tokens.meta.projectName });
    setTimeout(() => {
      setCopiedKey(null);
      setStatusMessage(null);
    }, 4000);
  };

  const handleAutoFixContrast = () => {
    const fixedLight = autoFixSemantic(tokens.color.semantic.light);
    const fixedDark = autoFixSemantic(tokens.color.semantic.dark);
    const fixedTokens: DesignTokens = {
      ...tokens,
      color: {
        ...tokens.color,
        semantic: {
          light: fixedLight,
          dark: fixedDark
        }
      }
    };
    if (onChange) {
      onChange({ tokens: fixedTokens });
    }
    setStatusMessage('OKLCH lightness nudged to achieve WCAG 2.2 AA compliance!');
    trackEvent('a11y_autofix_triggered');
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.5 } });
    setTimeout(() => setStatusMessage(null), 4000);
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
    trackEvent('export_downloaded', { filename });
  };

  const handleDownloadStarterZip = async () => {
    setIsPackaging(true);
    setStatusMessage('Compiling starter ZIP bundle with 14 token files & components...');
    trackEvent('export_starter_zip_started');
    try {
      const blob = await exportStarterZip(tokens);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectSlug}_starter.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      setStatusMessage('Starter ZIP downloaded successfully!');
      trackEvent('export_starter_zip_success');
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error generating starter zip:', err);
      setStatusMessage('Failed to generate starter ZIP. Check console.');
    } finally {
      setIsPackaging(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    setStatusMessage('Generating vector design system PDF...');
    trackEvent('export_pdf_started');
    try {
      await generateDesignSystemPdf(project);
      setStatusMessage('Design System PDF exported!');
      trackEvent('export_pdf_success');
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      console.error('PDF generation error:', err);
      setStatusMessage('PDF generation failed.');
    } finally {
      setIsGeneratingPdf(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDownloadPng = async () => {
    setIsGeneratingPng(true);
    setStatusMessage('Rendering high-res specimen PNG board...');
    trackEvent('export_png_started');
    try {
      await downloadVisualBoardPng(project);
      setStatusMessage('Specimen board PNG downloaded!');
      trackEvent('export_png_success');
    } catch (err) {
      console.error('PNG download error:', err);
      setStatusMessage('PNG render failed.');
    } finally {
      setIsGeneratingPng(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const headingFamilyClean = (tokens.typography.roles.heading?.family || 'Inter').toLowerCase().replace(/\s+/g, '-');
  const bodyFamilyClean = (tokens.typography.roles.body?.family || 'Inter').toLowerCase().replace(/\s+/g, '-');
  const fontInstallCommand = `npm install @fontsource-variable/${headingFamilyClean} @fontsource-variable/${bodyFamilyClean}`;

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
      id: 'tailwind3',
      title: 'Tailwind CSS v3 Config',
      filename: 'tailwind.v3.config.js',
      category: 'code',
      badge: 'Legacy Tailwind v3',
      description: 'Classic module.exports configuration with theme.extend color & font mappings.',
      getContent: () => exportTailwind3(tokens)
    },
    {
      id: 'css-vars',
      title: 'CSS Custom Properties',
      filename: 'tokens.css',
      category: 'code',
      badge: ':root & .dark',
      description: 'Zero runtime dependencies. Pure CSS variables for any web framework.',
      getContent: () => exportCssVars(tokens)
    },
    {
      id: 'scss-vars',
      title: 'SCSS Variables & Mixins',
      filename: 'tokens.scss',
      category: 'code',
      badge: 'Sass / SCSS',
      description: 'Sass variables with @mixin theme-light and @mixin theme-dark parity.',
      getContent: () => exportScss(tokens)
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
      id: 'figma-variables',
      title: 'Figma Variables (Native)',
      filename: 'figma.variables.json',
      category: 'code',
      badge: 'Modes: Light & Dark',
      description: 'Native Figma Variables REST API format with multi-mode collections for color and spacing.',
      getContent: () => exportFigmaVariables(tokens)
    },
    {
      id: 'style-dictionary',
      title: 'Style Dictionary Config',
      filename: 'style-dictionary.config.json',
      category: 'code',
      badge: 'Amazon SD Build',
      description: 'Multi-platform transformation configuration for CSS, SCSS, TypeScript, and JSON.',
      getContent: () => exportStyleDictionaryConfig(tokens)
    },
    {
      id: 'fonts-css',
      title: 'Self-Hosted Fonts CSS',
      filename: 'fonts.css',
      category: 'code',
      badge: 'GDPR / Local Hosting',
      description: '@font-face declarations and Fontsource package instructions for zero third-party tracking.',
      getContent: () => exportSelfHostedFonts(tokens)
    },
    {
      id: 'a11y-report',
      title: 'Accessibility Audit Report',
      filename: 'a11y-audit-report.md',
      category: 'assets',
      badge: 'WCAG 2.2 AA Deliverable',
      description: 'Client-ready markdown report with contrast matrix, APCA scores, and focus indicator specs.',
      getContent: () => exportA11yAuditReport(tokens)
    },
    {
      id: 'typescript',
      title: 'TypeScript Tokens Constant',
      filename: 'tokens.ts',
      category: 'code',
      badge: 'as const',
      description: 'Fully typed object with autocompletion for colors, typography, spacing, and radius.',
      getContent: () => exportTypeScript(tokens)
    },
    {
      id: 'shadcn',
      title: 'shadcn/ui Theme Definition',
      filename: 'shadcn-theme.css',
      category: 'code',
      badge: 'HSL/OKLCH Layer',
      description: 'Drop-in variables for components.json, matching standard shadcn primitives.',
      getContent: () => exportShadcn(tokens)
    },
    {
      id: 'figma-tokens-studio',
      title: 'Tokens Studio for Figma',
      filename: 'tokens.studio.json',
      category: 'code',
      badge: 'Tokens Studio Plugin',
      description: 'Two-way sync JSON for the Tokens Studio Figma plugin with set hierarchy.',
      getContent: () => exportFigmaTokensStudio(tokens)
    },
    {
      id: 'backup',
      title: 'Full Design Project JSON',
      filename: `${projectSlug}.dss.json`,
      category: 'code',
      badge: 'Studio Backup',
      description: 'Complete project file to re-import into Design System Studio later.',
      getContent: () => exportProjectJson(tokens)
    }
  ];

  // Starter ZIP file tree structure
  const starterTreeFiles = [
    { path: 'src/styles/theme.css', label: 'theme.css (Tailwind 4 @theme)' },
    { path: 'src/styles/tailwind.v3.config.js', label: 'tailwind.v3.config.js (Tailwind 3)' },
    { path: 'src/styles/tokens.css', label: 'tokens.css (CSS Custom Properties)' },
    { path: 'src/styles/tokens.scss', label: 'tokens.scss (SCSS Theme Mixins)' },
    { path: 'src/tokens/tokens.json', label: 'tokens.json (W3C DTCG Format)' },
    { path: 'src/tokens/figma.variables.json', label: 'figma.variables.json (Native Figma Modes)' },
    { path: 'src/tokens/style-dictionary.config.json', label: 'style-dictionary.config.json' },
    { path: 'src/fonts/fonts.css', label: 'fonts.css (Self-Hosted @font-face)' },
    { path: 'docs/a11y-audit-report.md', label: 'a11y-audit-report.md (Client Report)' },
    { path: 'src/tokens/tokens.ts', label: 'tokens.ts (TypeScript Const)' },
    { path: 'components/Button.tsx', label: 'components/Button.tsx (Accessible Component)' },
    { path: 'components/Card.tsx', label: 'components/Card.tsx (Accessible Component)' },
    { path: 'components/Input.tsx', label: 'components/Input.tsx (Accessible Component)' },
    { path: 'components/Badge.tsx', label: 'components/Badge.tsx (Accessible Component)' },
    { path: 'README.md', label: 'README.md (Multi-Format Guide)' }
  ];

  const getTreeFileContent = (path: string): string => {
    switch (path) {
      case 'src/styles/theme.css':
        return exportTailwind4(tokens);
      case 'src/styles/tailwind.v3.config.js':
        return exportTailwind3(tokens);
      case 'src/styles/tokens.css':
        return exportCssVars(tokens);
      case 'src/styles/tokens.scss':
        return exportScss(tokens);
      case 'src/tokens/tokens.json':
        return exportDtcgJson(tokens);
      case 'src/tokens/figma.variables.json':
        return exportFigmaVariables(tokens);
      case 'src/tokens/style-dictionary.config.json':
        return exportStyleDictionaryConfig(tokens);
      case 'src/fonts/fonts.css':
        return exportSelfHostedFonts(tokens);
      case 'docs/a11y-audit-report.md':
        return exportA11yAuditReport(tokens);
      case 'src/tokens/tokens.ts':
        return exportTypeScript(tokens);
      case 'components/Button.tsx':
        return `// Production Accessible Button consuming Design Tokens\nexport const Button = ...`;
      case 'components/Card.tsx':
        return `// Production Accessible Card consuming Design Tokens\nexport const Card = ...`;
      case 'components/Input.tsx':
        return `// Production Accessible Input with ARIA error description\nexport const Input = ...`;
      case 'components/Badge.tsx':
        return `// Production Accessible Status Badge\nexport const Badge = ...`;
      case 'README.md':
        return `# ${project.name} Design System Starter\n\nRun \`npm install\` then \`npm run dev\` to launch your design system preview.\nImport \`src/styles/theme.css\` in your root entry file.`;
      default:
        return '// File content';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title & Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 11 of 11 · Universal Export Center</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Export your complete design system
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Everything is ready for production. Download code themes in 13 formats, create a shareable hosted preview link, generate a vector brand PDF or specimen board PNG, or download an all-in-one developer starter ZIP.
        </p>
      </div>

      {statusMessage && (
        <div className="p-3 bg-neutral-900 text-white rounded-xl text-xs font-medium shadow-md flex items-center justify-between">
          <span>{statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-neutral-400 hover:text-white cursor-pointer">✕</button>
        </div>
      )}

      {/* Pre-Export Validation Gate (Doc 05 §Export Improvements #5) */}
      {hasFailingContrast ? (
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 shadow-sm space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <h3 className="font-bold text-sm text-amber-900">
                Pre-Export Accessibility Notice: {failingIssues.length} Failing Contrast Pair{failingIssues.length > 1 ? 's' : ''}
              </h3>
            </div>
            <button
              onClick={handleAutoFixContrast}
              className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fix All Ratios</span>
            </button>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            The following semantic tokens do not meet WCAG 2.2 AA contrast requirements. You can auto-fix them with intelligent OKLCH lightness nudging or review them in Step 10 before deploying to production.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
            {failingIssues.slice(0, 4).map((issue, idx) => (
              <div key={idx} className="p-2 rounded-lg bg-white/70 border border-amber-200/80 flex items-center justify-between">
                <span className="truncate">{issue.name} ({issue.mode})</span>
                <span className="font-bold text-amber-900">{issue.ratio}:1 &lt; {issue.targetRatio}:1</span>
              </div>
            ))}
            {failingIssues.length > 4 && (
              <div className="text-[10px] text-amber-700 pt-1">
                + {failingIssues.length - 4} more failing pairs. Click Auto-Fix to calibrate all tokens.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-2xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-semibold">
              Pre-Export Verification Passed: 100% of semantic tokens meet WCAG 2.2 AA contrast standards.
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
            WCAG 2.2 AA Cleared
          </span>
        </div>
      )}

      {/* Starter ZIP Featured Hero Card */}
      <div className="p-6 rounded-2xl bg-neutral-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-amber-400 text-[11px] font-mono font-bold">
            <Package className="w-3.5 h-3.5" />
            <span>Recommended for Developers</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Download Complete Vite & Tailwind Starter ZIP
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Includes all 13 token formats, Style Dictionary config, native Figma Variables, accessible Button/Card/Input/Badge components, and pre-wired font variable imports.
          </p>
        </div>

        <button
          onClick={handleDownloadStarterZip}
          disabled={isPackaging}
          className="px-5 py-3 rounded-xl bg-white text-neutral-900 hover:bg-neutral-100 transition-all font-bold text-xs flex items-center gap-2 shadow-lg cursor-pointer shrink-0 disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isPackaging ? 'Packaging Project...' : 'Download Starter ZIP'}</span>
        </button>
      </div>

      {/* Shareable Link & Quick Terminal Install Command */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shareable Hosted Preview */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800 mb-1">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Shareable Hosted Preview Link</span>
            </div>
            <p className="text-xs text-neutral-500">
              Generate a read-only live preview link encoded with your complete design tokens.
            </p>
          </div>
          <button
            onClick={handleCopyShareLink}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            {copiedKey === 'share-link' ? (
              <>
                <Check className="w-3.5 h-3.5 text-indigo-700" />
                <span>Link Copied to Clipboard ✓</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-indigo-600" />
                <span>Copy Shareable Preview Link</span>
              </>
            )}
          </button>
        </div>

        {/* Self-Hosted Fontsource Command */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                <Terminal className="w-3.5 h-3.5 text-neutral-600" />
                <span>Self-Hosted Fontsource Command</span>
              </div>
              <button
                onClick={() => handleCopy('fonts-cmd', fontInstallCommand)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
              >
                {copiedKey === 'fonts-cmd' ? 'Copied ✓' : 'Copy'}
              </button>
            </div>
            <code className="block p-2 rounded-lg bg-neutral-900 text-neutral-200 text-[11px] font-mono break-all select-all">
              {fontInstallCommand}
            </code>
          </div>
        </div>
      </div>

      {/* Interactive Starter ZIP File Tree Preview (Doc 02 §11) */}
      <div className="p-5 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-3">
        <div className="flex items-center gap-2">
          <FolderTree className="w-4 h-4 text-neutral-700" />
          <h3 className="text-sm font-bold text-neutral-900">
            Starter Bundle File Tree & Source Preview
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Inspect the files bundled in your starter project before downloading. Click any file to view its generated code.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Tree column */}
          <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-200 text-xs space-y-1 max-h-72 overflow-y-auto">
            <div className="flex items-center gap-1.5 font-bold text-neutral-700 pb-2 border-b border-neutral-200 font-mono">
              <Folder className="w-3.5 h-3.5 text-amber-500" />
              <span>{projectSlug}-starter/</span>
            </div>
            {starterTreeFiles.map(file => (
              <button
                key={file.path}
                onClick={() => setSelectedTreeFile(file.path)}
                className={`w-full text-left px-2 py-1.5 rounded-lg font-mono text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedTreeFile === file.path
                    ? 'bg-neutral-900 text-white font-bold'
                    : 'text-neutral-600 hover:bg-neutral-200/60'
                }`}
              >
                <File className="w-3 h-3 shrink-0" />
                <span className="truncate">{file.path}</span>
              </button>
            ))}
          </div>

          {/* Code viewer column */}
          <div className="md:col-span-2 bg-neutral-950 text-neutral-200 rounded-xl p-3 border border-neutral-800 font-mono text-[11px] overflow-hidden flex flex-col justify-between max-h-72">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-800 text-[10px] text-neutral-400">
              <span className="truncate max-w-xs">{selectedTreeFile}</span>
              <button
                onClick={() => handleCopy('tree-file', getTreeFileContent(selectedTreeFile))}
                className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer shrink-0"
              >
                {copiedKey === 'tree-file' ? 'Copied ✓' : 'Copy File Content'}
              </button>
            </div>
            <pre className="overflow-auto py-2 text-[10px] text-neutral-300 flex-1 leading-relaxed">
              {getTreeFileContent(selectedTreeFile)}
            </pre>
          </div>
        </div>
      </div>

      {/* Visual Assets & Documentation (PDF & PNG) */}
      <div className="space-y-3">
        <div className="text-xs uppercase font-bold tracking-wider text-neutral-500 font-mono">
          Visual Assets & Presentation Artifacts
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PDF Book */}
          <div className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-neutral-900">Design System Brand PDF</h3>
              </div>
              <p className="text-xs text-neutral-500">
                Vector document with computed OKLCH color ramps, WCAG 2.2 AA contrast audits, and typographic ladders.
              </p>
            </div>
            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isGeneratingPdf ? 'Rendering...' : 'Download PDF'}
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
              onClick={handleDownloadPng}
              disabled={isGeneratingPng}
              className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-semibold hover:bg-neutral-50 transition-colors cursor-pointer shrink-0 disabled:opacity-50"
            >
              {isGeneratingPng ? 'Rendering...' : 'Download PNG'}
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
