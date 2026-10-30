import { wcagContrast } from 'culori';
import { ColorScale, SemanticColors } from './types';

function getBestOnColor(bgHex: string): string {
  const contrastWhite = wcagContrast('#FFFFFF', bgHex);
  const contrastBlack = wcagContrast('#0A0A0A', bgHex);
  return contrastWhite >= contrastBlack ? '#FFFFFF' : '#0A0A0A';
}

/**
 * Creates light mode semantic mapping from raw color primitives.
 */
export function createLightSemanticColors(
  primitives: Record<'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info', ColorScale>
): SemanticColors {
  const brand = primitives.brand;
  const neutral = primitives.neutral;
  const success = primitives.success;
  const warning = primitives.warning;
  const danger = primitives.danger;
  const info = primitives.info;

  const actionPrimary = brand[600];

  return {
    bgDefault: neutral[50],
    bgSurface: '#FFFFFF',
    bgElevated: '#FFFFFF',
    fgDefault: neutral[900],
    fgMuted: neutral[600],
    borderDefault: neutral[200],
    actionPrimary,
    actionPrimaryFg: getBestOnColor(actionPrimary),
    actionPrimaryHover: brand[700],
    focusRing: brand[500],
    statusSuccess: success[600],
    statusSuccessBg: success[50],
    statusSuccessFg: success[900],
    statusWarning: warning[600],
    statusWarningBg: warning[50],
    statusWarningFg: warning[900],
    statusDanger: danger[600],
    statusDangerBg: danger[50],
    statusDangerFg: danger[900],
    statusInfo: info[600],
    statusInfoBg: info[50],
    statusInfoFg: info[900]
  };
}

/**
 * Creates dark mode semantic mapping from raw color primitives.
 * Dark mode uses elevated surface lightness and avoids pure #000000.
 */
export function createDarkSemanticColors(
  primitives: Record<'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info', ColorScale>
): SemanticColors {
  const brand = primitives.brand;
  const neutral = primitives.neutral;
  const success = primitives.success;
  const warning = primitives.warning;
  const danger = primitives.danger;
  const info = primitives.info;

  const actionPrimary = brand[400];

  return {
    bgDefault: neutral[950],
    bgSurface: neutral[900],
    bgElevated: neutral[800],
    fgDefault: neutral[50],
    fgMuted: neutral[400],
    borderDefault: neutral[700],
    actionPrimary,
    actionPrimaryFg: getBestOnColor(actionPrimary),
    actionPrimaryHover: brand[300],
    focusRing: brand[300],
    statusSuccess: success[400],
    statusSuccessBg: success[950],
    statusSuccessFg: success[100],
    statusWarning: warning[400],
    statusWarningBg: warning[950],
    statusWarningFg: warning[100],
    statusDanger: danger[400],
    statusDangerBg: danger[950],
    statusDangerFg: danger[100],
    statusInfo: info[400],
    statusInfoBg: info[950],
    statusInfoFg: info[100]
  };
}
