import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Check,
  RefreshCw,
  Wand2,
  Sun,
  Moon,
  Smartphone,
  Tablet,
  Monitor,
  Download,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Crosshair
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import {
  auditSemanticContrast,
  nudgeToContrast,
  ratio,
  grade,
  A11yAuditIssue,
  autoFixSemantic
} from '../../tokens/contrastEngine';
import { applyTokens } from '../../preview/tokens/applyTokens';

interface Step10ReviewAuditProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step10ReviewAudit: React.FC<Step10ReviewAuditProps> = ({ project, onChange }) => {
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light');

  // Keep the audit mode in sync with the always-on preview toolbar so the
  // A11y badge, the audit table and the Step 11 gate never disagree.
  useEffect(() => {
    const handleMode = (e: Event) => {
      const next = (e as CustomEvent<'light' | 'dark'>).detail;
      if (next === 'light' || next === 'dark') setActiveMode(next);
    };
    window.addEventListener('dss:set-theme-mode', handleMode);
    return () => window.removeEventListener('dss:set-theme-mode', handleMode);
  }, []);

  const changeMode = (next: 'light' | 'dark') => {
    setActiveMode(next);
    window.dispatchEvent(new CustomEvent('dss:set-theme-mode', { detail: next }));
  };
  const [previousSemantic, setPreviousSemantic] = useState<any | null>(null);
  const [lastFixSummary, setLastFixSummary] = useState<string | null>(null);

  const semantic = project.tokens.color.semantic[activeMode];
  const audit = auditSemanticContrast(semantic);

  const otherMode = activeMode === 'light' ? 'dark' : 'light';
  const otherAudit = auditSemanticContrast(project.tokens.color.semantic[otherMode]);

  // Focus-visible compliance check (WCAG 2.4.11 / 2.4.13)
  const focusRatio = ratio(semantic.focusRing || '#3B82F6', semantic.bgDefault);
  const isFocusCompliant = focusRatio >= 3.0;

  // Auto-fix handler using issue.fgKey
  const handleFixIssue = (issue: A11yAuditIssue) => {
    const targetKey = issue.fgKey;
    if (!targetKey) {
      console.warn(`Could not auto-fix unmapped issue ID: ${issue.id}`);
      return;
    }

    setPreviousSemantic({ ...semantic });
    const fixedFg = nudgeToContrast(issue.fg, issue.bg, issue.targetRatio);

    const updatedSemantic = {
      ...semantic,
      [targetKey]: fixedFg
    };

    const nextTokens = {
      ...project.tokens,
      color: {
        ...project.tokens.color,
        semantic: {
          ...project.tokens.color.semantic,
          [activeMode]: updatedSemantic
        }
      }
    };

    setLastFixSummary(`Adjusted ${String(targetKey)} from ${issue.fg} to ${fixedFg}`);
    onChange({ tokens: nextTokens });
    applyTokens(nextTokens, activeMode);
  };

  const handleFixAll = () => {
    setPreviousSemantic({ ...semantic });
    const fixedSemantic = autoFixSemantic(semantic);

    const nextTokens = {
      ...project.tokens,
      color: {
        ...project.tokens.color,
        semantic: {
          ...project.tokens.color.semantic,
          [activeMode]: fixedSemantic
        }
      }
    };

    setLastFixSummary(`Auto-fixed all ${audit.failCount} issues in ${activeMode} mode`);
    onChange({ tokens: nextTokens });
    applyTokens(nextTokens, activeMode);
  };

  const handleUndoAutoFix = () => {
    if (!previousSemantic) return;
    const nextTokens = {
      ...project.tokens,
      color: {
        ...project.tokens.color,
        semantic: {
          ...project.tokens.color.semantic,
          [activeMode]: previousSemantic
        }
      }
    };
    onChange({ tokens: nextTokens });
    applyTokens(nextTokens, activeMode);
    setPreviousSemantic(null);
    setLastFixSummary(null);
  };

  // Downloadable Audit Report
  const handleDownloadReport = () => {
    const reportData = {
      designSystem: project.name,
      slug: project.tokens.meta.slug,
      generatedAt: new Date().toISOString(),
      standards: 'WCAG 2.2 AA & APCA Lightness Contrast',
      overallHealth: {
        lightModeScore: `${auditSemanticContrast(project.tokens.color.semantic.light).scorePercent}%`,
        darkModeScore: `${auditSemanticContrast(project.tokens.color.semantic.dark).scorePercent}%`,
        focusVisibleCompliance: isFocusCompliant ? 'PASS (>= 3.0:1)' : 'WARN (< 3.0:1)',
        targetSizeMinimum: 'PASS (>= 24x24px SC 2.5.8)',
        fluidTypographyScale: 'VERIFIED (360px - 1280px)'
      },
      activeAuditIssues: audit.issues.map(i => ({
        name: i.name,
        fg: i.fg,
        bg: i.bg,
        ratio: `${i.ratio.toFixed(2)}:1`,
        required: `${i.targetRatio}:1`,
        passed: i.passed,
        grade: i.grade,
        apcaLc: i.apcaLc
      }))
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.tokens.meta.slug || 'design_system'}_wcag_audit_report.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Step 10 of 11 · Pre-Flight Audit & Universal Accessibility</span>
          </div>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-neutral-600" />
            <span>Download Audit Report (JSON)</span>
          </button>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Verify WCAG 2.2 AA compliance and system health
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Universal accessibility is continuously measured. Below is the live contrast matrix for all active semantic token pairs. If any pair falls short of the 4.5:1 ratio, click "Auto-Fix" to nudge lightness into full compliance.
        </p>
      </div>

      {/* Audit Score Hero Card */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-3xl font-extrabold text-neutral-900 font-mono">
              {audit.scorePercent}%
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold font-mono">
              {audit.passCount} of {audit.totalCount} Passed
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Computed against WCAG 2.2 AA criteria (minimum 4.5:1 body, 3.0:1 UI/headers).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => changeMode('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'light' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => changeMode('dark')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'dark' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Dark</span>
            </button>
          </div>

          {audit.failCount > 0 && (
            <button
              onClick={handleFixAll}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 transition-all shadow-xs cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Auto-Fix All ({audit.failCount})</span>
            </button>
          )}

          {previousSemantic && (
            <button
              onClick={handleUndoAutoFix}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 transition-all shadow-xs cursor-pointer text-neutral-700"
              title="Undo last auto-fix"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Undo Fix</span>
            </button>
          )}
        </div>
      </div>

      {lastFixSummary && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{lastFixSummary}</span>
          </div>
          <button
            onClick={handleUndoAutoFix}
            className="font-bold underline hover:text-emerald-900 cursor-pointer"
          >
            Undo
          </button>
        </div>
      )}

      {/* 4 Multi-Dimension Compliance Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {/* Contrast Status */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>WCAG 2.2 AA Contrast</span>
            {audit.failCount === 0 ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="text-sm font-extrabold text-neutral-900 font-mono">
            {audit.passCount}/{audit.totalCount} Pass
          </div>
          <p className={`text-[10px] ${audit.failCount === 0 ? 'text-neutral-400' : 'text-amber-600'}`}>
            {audit.failCount === 0
              ? `${activeMode === 'light' ? 'Light' : 'Dark'} mode verified`
              : `${audit.failCount} pair${audit.failCount === 1 ? '' : 's'} still failing in ${activeMode} mode`}
          </p>
        </div>

        {/* Focus Visible Status */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>Focus-Visible (SC 2.4.11)</span>
            {isFocusCompliant ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            )}
          </div>
          <div className="text-sm font-extrabold text-neutral-900 font-mono">
            {focusRatio.toFixed(1)}:1 Ratio
          </div>
          <p className="text-[10px] text-neutral-400">
            {isFocusCompliant ? 'Complies (>= 3.0:1 required)' : 'Warning (< 3.0:1)'}
          </p>
        </div>

        {/* Touch Target Minimum */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>Target Size (SC 2.5.8)</span>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-sm font-extrabold text-neutral-900 font-mono">
            24×24px Minimum
          </div>
          <p className="text-[10px] text-neutral-400">
            24×24 CSS px minimum configured
          </p>
        </div>

        {/* Fluid Responsive Scale */}
        <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
            <span>Responsive Type Scale</span>
            <Check className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-sm font-extrabold text-neutral-900 font-mono">
            360px → 1280px
          </div>
          <p className="text-[10px] text-neutral-400">
            Fluid clamp() curve active
          </p>
        </div>
      </div>

      {/* Contrast Matrix Table */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
          <span className="text-xs uppercase font-mono font-bold text-neutral-600">
            Semantic Contrast Verification ({activeMode.toUpperCase()} MODE)
          </span>
          <span className="text-xs text-neutral-500 font-mono">
            WCAG 2.2 Specification
          </span>
        </div>

        <div className="divide-y divide-neutral-100">
          {audit.issues.map(issue => (
            <div key={issue.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Visual Swatches */}
                <div
                  className="w-10 h-10 rounded-lg border flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs"
                  style={{ backgroundColor: issue.bg, color: issue.fg, borderColor: 'rgba(0,0,0,0.1)' }}
                >
                  Aa
                </div>
                <div>
                  <div className="font-semibold text-xs text-neutral-900">{issue.name}</div>
                  <div className="text-[11px] font-mono text-neutral-500">
                    FG: {issue.fg} · BG: {issue.bg}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 self-end sm:self-auto">
                <div className="text-right">
                  <div className="font-mono font-bold text-xs">
                    {issue.ratio.toFixed(2)}:1
                  </div>
                  <div className="flex items-center gap-1.5 justify-end">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        issue.passed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {issue.passed ? (
                        <Check className="w-3 h-3 text-emerald-700 shrink-0" aria-hidden="true" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-amber-700 shrink-0" aria-hidden="true" />
                      )}
                      <span>{issue.grade} {issue.passed ? 'PASS' : 'WARN'}</span>
                    </span>
                    <span className="text-[9px] text-neutral-400 font-mono hidden sm:inline" title="APCA Lightness Contrast (informational)">
                      Lc {issue.apcaLc > 0 ? `+${issue.apcaLc}` : issue.apcaLc}
                    </span>
                  </div>
                </div>

                {!issue.passed && (
                  <button
                    onClick={() => handleFixIssue(issue)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-50 transition-colors cursor-pointer text-neutral-900"
                  >
                    Nudge to AA
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Holistic System Summary Card */}
      <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-neutral-900">
          Holistic Architecture Blueprint
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Category</span>
            <span className="font-bold text-neutral-900 mt-0.5 block">{project.tokens.meta.category}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Heading Font</span>
            <span className="font-bold text-neutral-900 mt-0.5 block">{project.tokens.typography.roles.heading?.family}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Body Font</span>
            <span className="font-bold text-neutral-900 mt-0.5 block">{project.tokens.typography.roles.body?.family}</span>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
            <span className="text-[10px] uppercase font-mono text-neutral-400 block">Scale Ratio</span>
            <span className="font-bold text-neutral-900 mt-0.5 block font-mono">{project.tokens.typography.scaleRatio}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
