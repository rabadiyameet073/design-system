import { TypographyTokens, FontRole } from './types';
import { FontMeta } from '../utils/typeScale';

export interface TypographyGuardrailIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  recommendation?: string;
}

export interface TypographyAuditResult {
  issues: TypographyGuardrailIssue[];
  estimatedPayloadKb: number;
  totalFamiliesCount: number;
  totalFontFiles: number;
  hasErrors: boolean;
}

/**
 * Evaluates typography tokens against production guardrails per Doc 03 §8.
 */
export function auditTypographyTokens(
  typography: TypographyTokens,
  fontsMetaMap?: Map<string, FontMeta>
): TypographyAuditResult {
  const issues: TypographyGuardrailIssue[] = [];
  const roles = typography.roles;

  // 1. Count distinct non-mono families
  const distinctFamilies = new Set<string>();
  const allFamilies = new Set<string>();
  const roleWeightsByFamily = new Map<string, Set<number>>();

  (Object.keys(roles) as FontRole[]).forEach(role => {
    const style = roles[role];
    if (style?.family && style.family !== 'inherit') {
      allFamilies.add(style.family);
      if (role !== 'mono') {
        distinctFamilies.add(style.family);
      }
      if (!roleWeightsByFamily.has(style.family)) {
        roleWeightsByFamily.set(style.family, new Set<number>());
      }
      if (style.weight) {
        roleWeightsByFamily.get(style.family)!.add(style.weight);
      }
      // Body typically requires both 400 (regular) and 700 (bold) in production
      if (role === 'body') {
        roleWeightsByFamily.get(style.family)!.add(400);
        roleWeightsByFamily.get(style.family)!.add(700);
      }
    }
  });

  if (distinctFamilies.size > 2) {
    issues.push({
      id: 'too-many-families',
      severity: 'warning',
      message: 'More than 2 font families usually looks inconsistent and slows the page.',
      recommendation: 'Stick to 1 variable family or 1 heading + 1 body family.'
    });
  }

  // 2. Base text size check (< 16px)
  if (typography.baseSizePx < 16) {
    issues.push({
      id: 'body-size-too-small',
      severity: 'warning',
      message: 'Body text under 16 px hurts readability on mobile.',
      recommendation: 'Set root base size to at least 16px (18px for mature audiences).'
    });
  }

  // 3. Category & weight check for body
  const bodyFamily = roles.body?.family;
  const headingFamily = roles.heading?.family;

  let bodyMeta: FontMeta | undefined;
  let headingMeta: FontMeta | undefined;

  if (fontsMetaMap) {
    if (bodyFamily) bodyMeta = fontsMetaMap.get(bodyFamily);
    if (headingFamily) headingMeta = fontsMetaMap.get(headingFamily);
  }

  if (bodyMeta) {
    // Body cannot be display or handwriting
    if (bodyMeta.category === 'display' || bodyMeta.category === 'handwriting') {
      issues.push({
        id: 'invalid-body-category',
        severity: 'error',
        message: 'Display and handwriting fonts cause extreme eyestrain in body paragraphs.',
        recommendation: 'Choose a high-legibility sans-serif or serif for the body role.'
      });
    }

    // Required weights: regular (400) and bold (600/700)
    const hasRegular = bodyMeta.variants.some(v => v === 'regular' || v === '400');
    const hasBold = bodyMeta.variants.some(v => v === '600' || v === '700' || v === 'bold');
    if (!hasRegular || (!hasBold && !bodyMeta.variable)) {
      issues.push({
        id: 'missing-body-weights',
        severity: 'warning',
        message: 'Body font lacks weight 400 or 700 for structural text hierarchy.',
        recommendation: 'Select a family that includes regular and bold variants.'
      });
    }

    // Script check
    const requiredScripts = typography.scripts || ['latin'];
    for (const reqScript of requiredScripts) {
      if (reqScript !== 'latin') {
        const hasScript = bodyMeta.subsets.some(s => s.toLowerCase().includes(reqScript.toLowerCase()));
        if (!hasScript) {
          issues.push({
            id: `missing-script-${reqScript}`,
            severity: 'error',
            message: `Body font "${bodyFamily}" does not support your required script: ${reqScript}.`,
            recommendation: `Filter by "${reqScript}" in the font picker.`
          });
        }
      }
    }
  }

  // 4. Contrast check: two different families in the same category often look muddy
  if (bodyMeta && headingMeta && bodyMeta.family !== headingMeta.family) {
    if (bodyMeta.category === headingMeta.category) {
      issues.push({
        id: 'similar-categories',
        severity: 'info',
        message: `Both heading and body are ${headingMeta.category} from different families, which can appear mismatched.`,
        recommendation: 'Consider pairing a serif with a sans-serif, or using a single versatile family.'
      });
    }
  }

  // 5. Total font files and payload estimation (Doc 03 §8)
  // Variable font: 1 file (~70KB woff2). Static font: ~25KB per static weight file.
  let totalFontFiles = 0;
  let estimatedPayloadKb = 0;

  allFamilies.forEach(family => {
    const meta = fontsMetaMap?.get(family);
    if (meta?.variable) {
      totalFontFiles += 1;
      estimatedPayloadKb += 70;
    } else {
      const weightsSet = roleWeightsByFamily.get(family);
      const fileCount = weightsSet && weightsSet.size > 0 ? weightsSet.size : 2;
      totalFontFiles += fileCount;
      estimatedPayloadKb += fileCount * 25;
    }
  });

  if (totalFontFiles > 6) {
    issues.push({
      id: 'total-font-files',
      severity: 'warning',
      message: 'Consider fewer weights/styles to keep the page fast.',
      recommendation: `You currently have ${totalFontFiles} font files scheduled. Reduce static weight variations or switch to variable fonts.`
    });
  }

  if (estimatedPayloadKb > 150) {
    issues.push({
      id: 'high-payload',
      severity: 'warning',
      message: `Estimated font payload (≈ ${estimatedPayloadKb} KB) exceeds the 150 KB performance budget.`,
      recommendation: 'Consider using variable fonts or fewer font families.'
    });
  }

  const hasErrors = issues.some(i => i.severity === 'error');

  return {
    issues,
    estimatedPayloadKb,
    totalFamiliesCount: allFamilies.size,
    totalFontFiles,
    hasErrors
  };
}

