import { wcagContrast, oklch, formatHex, clampChroma, type Oklch } from 'culori';
import { SemanticColors } from './types';

/**
 * Computes exact WCAG 2.2 contrast ratio between foreground and background.
 */
export function ratio(fg: string, bg: string): number {
  try {
    const val = wcagContrast(fg, bg);
    return isNaN(val) ? 1 : val;
  } catch {
    return 1;
  }
}

/**
 * Returns WCAG compliance grade based on contrast ratio and text size.
 */
export function grade(r: number, large = false): 'AAA' | 'AA' | 'Fail' {
  if (r >= 7.0) return 'AAA';
  if (r >= 4.5) return large ? 'AAA' : 'AA';
  if (r >= 3.0) return large ? 'AA' : 'Fail';
  return 'Fail';
}

/**
 * Auto-fix: steps OKLCH lightness in 0.01 increments toward higher contrast
 * until ratio >= target (default 4.5 for normal text, 3.0 for large text/UI).
 * Preserves the original hue and chroma.
 */
export function nudgeToContrast(fg: string, bg: string, target = 4.5): string {
  const currentRatio = ratio(fg, bg);
  if (currentRatio >= target) return fg;

  const fgOklch = oklch(fg);
  const bgOklch = oklch(bg);
  if (!fgOklch || !bgOklch) return fg;

  const bgLightness = bgOklch.l ?? 0.5;
  // If background is bright, step foreground toward 0 (darker); if dark, step toward 1 (brighter)
  const stepDirection = bgLightness > 0.5 ? -0.01 : 0.01;

  let candidateL = fgOklch.l ?? 0.5;
  let iterations = 0;
  const maxIterations = 80;

  while (iterations < maxIterations) {
    candidateL += stepDirection;
    if (candidateL <= 0.02 || candidateL >= 0.98) {
      break;
    }

    const candidate: Oklch = {
      mode: 'oklch',
      l: candidateL,
      c: fgOklch.c ?? 0.1,
      h: fgOklch.h ?? 0
    };

    const candidateHex = formatHex(clampChroma(candidate, 'rgb'));
    if (ratio(candidateHex, bg) >= target) {
      return candidateHex;
    }

    iterations++;
  }

  // Extreme fallback: black or white
  return bgLightness > 0.5 ? '#0A0A0A' : '#FFFFFF';
}

export interface A11yAuditIssue {
  id: string;
  name: string;
  fg: string;
  bg: string;
  ratio: number;
  targetRatio: number;
  grade: 'AAA' | 'AA' | 'Fail';
  isLarge: boolean;
  passed: boolean;
  suggestedFg: string;
}

export interface A11yAuditSummary {
  passCount: number;
  failCount: number;
  totalCount: number;
  scorePercent: number;
  issues: A11yAuditIssue[];
}

/**
 * Audits all critical semantic pairs in either light or dark mode.
 */
export function auditSemanticContrast(semantic: SemanticColors): A11yAuditSummary {
  const auditPairs: Array<{
    id: string;
    name: string;
    fg: string;
    bg: string;
    targetRatio: number;
    isLarge: boolean;
  }> = [
    {
      id: 'body-default',
      name: 'Body Text on Canvas',
      fg: semantic.fgDefault,
      bg: semantic.bgDefault,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'body-surface',
      name: 'Body Text on Card Surface',
      fg: semantic.fgDefault,
      bg: semantic.bgSurface,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'muted-default',
      name: 'Muted Text on Canvas',
      fg: semantic.fgMuted,
      bg: semantic.bgDefault,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'action-primary',
      name: 'Primary Button Label',
      fg: semantic.actionPrimaryFg,
      bg: semantic.actionPrimary,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'border-ui',
      name: 'Card & Control Border (UI Components)',
      fg: semantic.borderDefault,
      bg: semantic.bgDefault,
      targetRatio: 3.0,
      isLarge: true
    },
    {
      id: 'focus-ring',
      name: 'Focus Ring Indicator',
      fg: semantic.focusRing,
      bg: semantic.bgDefault,
      targetRatio: 3.0,
      isLarge: true
    },
    {
      id: 'status-success',
      name: 'Success Badge Label',
      fg: semantic.statusSuccessFg,
      bg: semantic.statusSuccessBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-warning',
      name: 'Warning Badge Label',
      fg: semantic.statusWarningFg,
      bg: semantic.statusWarningBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-danger',
      name: 'Danger Badge Label',
      fg: semantic.statusDangerFg,
      bg: semantic.statusDangerBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-info',
      name: 'Info Badge Label',
      fg: semantic.statusInfoFg,
      bg: semantic.statusInfoBg,
      targetRatio: 4.5,
      isLarge: false
    }
  ];

  const issues: A11yAuditIssue[] = auditPairs.map(item => {
    const r = ratio(item.fg, item.bg);
    const g = grade(r, item.isLarge);
    const passed = r >= item.targetRatio;

    return {
      id: item.id,
      name: item.name,
      fg: item.fg,
      bg: item.bg,
      ratio: Math.round(r * 100) / 100,
      targetRatio: item.targetRatio,
      grade: g,
      isLarge: item.isLarge,
      passed,
      suggestedFg: passed ? item.fg : nudgeToContrast(item.fg, item.bg, item.targetRatio)
    };
  });

  const passCount = issues.filter(i => i.passed).length;
  const failCount = issues.length - passCount;
  const scorePercent = Math.round((passCount / issues.length) * 100);

  return {
    passCount,
    failCount,
    totalCount: issues.length,
    scorePercent,
    issues
  };
}

