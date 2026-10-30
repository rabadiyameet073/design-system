import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Check, RefreshCw, Wand2, Sun, Moon, Smartphone, Tablet, Monitor } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';
import { auditSemanticContrast, nudgeToContrast, ratio, grade, A11yAuditIssue } from '../../tokens/contrastEngine';
import { applyTokens } from '../../preview/tokens/applyTokens';

interface Step10ReviewAuditProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step10ReviewAudit: React.FC<Step10ReviewAuditProps> = ({ project, onChange }) => {
  const [activeMode, setActiveMode] = useState<'light' | 'dark'>('light');

  const semantic = project.tokens.color.semantic[activeMode];
  const audit = auditSemanticContrast(semantic);

  // Auto-fix handler using nudgeToContrast
  const handleFixIssue = (issue: A11yAuditIssue) => {
    const fixedFg = nudgeToContrast(issue.fg, issue.bg, issue.targetRatio);

    const updatedSemantic = {
      ...semantic,
      [issue.id === 'body-text' ? 'fgDefault' : issue.id === 'primary-action' ? 'actionPrimaryFg' : issue.id === 'muted-text' ? 'fgMuted' : 'fgDefault']: fixedFg
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

    onChange({ tokens: nextTokens });
    applyTokens(nextTokens, activeMode);
  };

  const handleFixAll = () => {
    let nextSemantic = { ...semantic };

    audit.issues.forEach(issue => {
      if (!issue.passed) {
        const fixedFg = nudgeToContrast(issue.fg, issue.bg, issue.targetRatio);
        if (issue.id === 'body-text') nextSemantic.fgDefault = fixedFg;
        if (issue.id === 'primary-action') nextSemantic.actionPrimaryFg = fixedFg;
        if (issue.id === 'muted-text') nextSemantic.fgMuted = fixedFg;
      }
    });

    const nextTokens = {
      ...project.tokens,
      color: {
        ...project.tokens.color,
        semantic: {
          ...project.tokens.color.semantic,
          [activeMode]: nextSemantic
        }
      }
    };

    onChange({ tokens: nextTokens });
    applyTokens(nextTokens, activeMode);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Step 10 of 11 · Pre-Flight Audit & Universal Accessibility</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Verify WCAG 2.2 AA compliance and system health
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
          Universal accessibility is mathematically verified. Below is the live contrast matrix for all active semantic token pairs. If any pair falls short of the 4.5:1 ratio, click "Auto-Fix" to nudge lightness into full compliance.
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

        <div className="flex items-center gap-3">
          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveMode('light')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMode === 'light' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setActiveMode('dark')}
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
                      className={`inline-block px-2 py-0.2 rounded text-[10px] font-bold font-mono ${
                        issue.passed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {issue.grade} {issue.passed ? 'PASS' : 'WARN'}
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

