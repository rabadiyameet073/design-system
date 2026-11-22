import { wcagContrast, oklch, rgb, formatHex, clampChroma, type Oklch } from 'culori';
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

  // Pick the direction (darker/lighter) that can actually reach the target: compare black vs white ceiling
  const blackR = ratio('#000000', bg);
  const whiteR = ratio('#FFFFFF', bg);
  const goDarker = blackR >= whiteR;
  const stepDirection = goDarker ? -0.01 : 0.01;

  let candidateL = fgOklch.l ?? 0.5;
  let iterations = 0;
  const maxIterations = 80;

  while (iterations < maxIterations) {
    candidateL += stepDirection;
    if (candidateL <= 0.02 || candidateL >= 0.98) {
      break;
    }

    const origL = fgOklch.l ?? 0.5;
    const chromaFactor = origL > 0.05 ? candidateL / origL : 1;
    const candidateC = Math.max(0, (fgOklch.c ?? 0.1) * Math.min(1.1, chromaFactor));

    const candidate: Oklch = {
      mode: 'oklch',
      l: candidateL,
      c: candidateC,
      h: fgOklch.h ?? 0
    };

    const candidateHex = formatHex(clampChroma(candidate, 'rgb'));
    if (ratio(candidateHex, bg) >= target) {
      return candidateHex;
    }

    iterations++;
  }

  // Extreme fallback: whichever of near-black / white has more contrast
  return goDarker ? '#0A0A0A' : '#FFFFFF';
}

/**
 * Calculates APCA (Accessible Perceptual Contrast Algorithm) Lightness Contrast (Lc)
 * value (-108 to +106) as an informational perceptual second opinion per Doc 04 §2.4.
 * Uses culori for robust color parsing (supports hex, rgb, rgba, hsl, oklch) with APCA-W3 soft black clamping.
 */
export function computeApcaLc(fg: string, bg: string): number {
  try {
    const cFg = rgb(fg);
    const cBg = rgb(bg);
    if (!cFg || !cBg) return 0;

    const sRgbToY = (c: { r: number; g: number; b: number }) => {
      const r = Math.pow(Math.max(0, Math.min(1, c.r ?? 0)), 2.4);
      const g = Math.pow(Math.max(0, Math.min(1, c.g ?? 0)), 2.4);
      const b = Math.pow(Math.max(0, Math.min(1, c.b ?? 0)), 2.4);
      return 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
    };

    let yTxt = sRgbToY(cFg);
    let yBg = sRgbToY(cBg);

    // Soft black clamping per APCA-W3
    const blkThrs = 0.022;
    const blkClmp = 1.414;
    if (yTxt <= blkThrs) yTxt += Math.pow(blkThrs - yTxt, blkClmp);
    if (yBg <= blkThrs) yBg += Math.pow(blkThrs - yBg, blkClmp);

    if (Math.abs(yBg - yTxt) < 0.0005) return 0;

    let lc = 0;
    if (yBg > yTxt) {
      // Dark text on light background
      lc = (Math.pow(yBg, 0.56) - Math.pow(yTxt, 0.57)) * 1.14 * 100 - 0.027;
    } else {
      // Light text on dark background
      lc = (Math.pow(yBg, 0.65) - Math.pow(yTxt, 0.62)) * 1.14 * 100 - 0.027;
    }

    return Math.round(lc * 10) / 10;
  } catch {
    return 0;
  }
}

export interface A11yAuditIssue {
  id: string;
  fgKey: keyof SemanticColors;
  name: string;
  fg: string;
  bg: string;
  ratio: number;
  apcaLc: number;
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
    fgKey: keyof SemanticColors;
    name: string;
    fg: string;
    bg: string;
    targetRatio: number;
    isLarge: boolean;
  }> = [
    {
      id: 'body-default',
      fgKey: 'fgDefault',
      name: 'Body Text on Canvas',
      fg: semantic.fgDefault,
      bg: semantic.bgDefault,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'body-surface',
      fgKey: 'fgDefault',
      name: 'Body Text on Card Surface',
      fg: semantic.fgDefault,
      bg: semantic.bgSurface,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'muted-default',
      fgKey: 'fgMuted',
      name: 'Muted Text on Canvas',
      fg: semantic.fgMuted,
      bg: semantic.bgDefault,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'action-primary',
      fgKey: 'actionPrimaryFg',
      name: 'Primary Button Label',
      fg: semantic.actionPrimaryFg,
      bg: semantic.actionPrimary,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'border-ui',
      fgKey: 'borderDefault',
      name: 'Card & Control Border (UI Components)',
      fg: semantic.borderDefault,
      bg: semantic.bgDefault,
      targetRatio: 3.0,
      isLarge: true
    },
    {
      id: 'focus-ring',
      fgKey: 'focusRing',
      name: 'Focus Ring Indicator',
      fg: semantic.focusRing,
      bg: semantic.bgDefault,
      targetRatio: 3.0,
      isLarge: true
    },
    {
      id: 'status-success',
      fgKey: 'statusSuccessFg',
      name: 'Success Badge Label',
      fg: semantic.statusSuccessFg,
      bg: semantic.statusSuccessBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-warning',
      fgKey: 'statusWarningFg',
      name: 'Warning Badge Label',
      fg: semantic.statusWarningFg,
      bg: semantic.statusWarningBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-danger',
      fgKey: 'statusDangerFg',
      name: 'Danger Badge Label',
      fg: semantic.statusDangerFg,
      bg: semantic.statusDangerBg,
      targetRatio: 4.5,
      isLarge: false
    },
    {
      id: 'status-info',
      fgKey: 'statusInfoFg',
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
      fgKey: item.fgKey,
      name: item.name,
      fg: item.fg,
      bg: item.bg,
      ratio: Math.round(r * 100) / 100,
      apcaLc: computeApcaLc(item.fg, item.bg),
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

/**
 * Auto-fixes all failing contrast pairs in a semantic color set by nudging
 * foreground colors to meet WCAG AA standards.
 * Two passes ensure that any interdependent pairs are mutually satisfied.
 */
export function autoFixSemantic(semantic: SemanticColors): SemanticColors {
  const next = { ...semantic };
  for (let pass = 0; pass < 2; pass++) {
    for (const issue of auditSemanticContrast(next).issues) {
      if (!issue.passed) {
        (next as Record<string, string>)[issue.fgKey] = nudgeToContrast(
          (next as Record<string, string>)[issue.fgKey],
          issue.bg,
          issue.targetRatio
        );
      }
    }
  }
  return next;
}


