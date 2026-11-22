import { DesignProject } from '../types/designSystem';
import { auditContrast } from './contrast';

/**
 * Resolves active color tokens, prioritizing 3-tier DesignTokens when present
 */
export function getResolvedProjectColors(project: DesignProject) {
  const light = project.tokens?.color?.semantic?.light;
  const brandShades = project.tokens?.color?.primitives?.brand;
  const neutralShades = project.tokens?.color?.primitives?.neutral;

  return {
    name: project.colorPalette?.name || 'Custom Brand System',
    description: project.colorPalette?.description || 'Engineered with OKLCH Color Engine',
    primary: light?.actionPrimary || brandShades?.[600] || project.colorPalette.primary,
    secondary: neutralShades?.[700] || project.colorPalette.secondary,
    accent: brandShades?.[400] || project.colorPalette.accent,
    background: light?.bgDefault || project.colorPalette.background,
    backgroundAlt: light?.bgSurface || project.colorPalette.backgroundAlt,
    surface: light?.bgSurface || project.colorPalette.surface,
    surfaceBorder: light?.borderDefault || project.colorPalette.surfaceBorder,
    textPrimary: light?.fgDefault || project.colorPalette.textPrimary,
    textSecondary: light?.fgMuted || project.colorPalette.textSecondary,
    textMuted: light?.fgMuted || project.colorPalette.textMuted,
    link: light?.actionPrimary || project.colorPalette.link,
    focusRing: light?.focusRing || project.colorPalette.focusRing,
    shades: {
      50: brandShades?.[50] || project.colorPalette.shades[50],
      100: brandShades?.[100] || project.colorPalette.shades[100],
      200: brandShades?.[200] || project.colorPalette.shades[200],
      300: brandShades?.[300] || project.colorPalette.shades[300],
      400: brandShades?.[400] || project.colorPalette.shades[400],
      500: brandShades?.[500] || project.colorPalette.shades[500],
      600: brandShades?.[600] || project.colorPalette.shades[600],
      700: brandShades?.[700] || project.colorPalette.shades[700],
      800: brandShades?.[800] || project.colorPalette.shades[800],
      900: brandShades?.[900] || project.colorPalette.shades[900],
    }
  };
}

/**
 * Resolves active typography tokens, prioritizing 3-tier DesignTokens when present
 */
export function getResolvedProjectTypography(project: DesignProject) {
  const roles = project.tokens?.typography?.roles;
  return {
    name: project.typography?.name || `${roles?.heading?.family || 'Heading'} / ${roles?.body?.family || 'Body'}`,
    displayFont: roles?.heading?.family || project.typography.displayFont,
    headingFont: roles?.heading?.family || project.typography.headingFont,
    bodyFont: roles?.body?.family || project.typography.bodyFont,
    monoFont: roles?.mono?.family || project.typography.monoFont,
    headingWeight: String(roles?.heading?.weight || project.typography.headingWeight),
    bodyWeight: String(roles?.body?.weight || project.typography.bodyWeight),
  };
}

/**
 * Generates a clean, professional multi-page PDF specification
 */
export async function generateDesignSystemPdf(project: DesignProject): Promise<void> {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Helper for page headers/footers
  const addFooter = (pageNum: number, totalPages: number) => {
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `${project.name} · Design System Specification`,
      margin,
      pageHeight - 12
    );
    doc.text(
      `Page ${pageNum} of ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 12
    );
  };

  // --- PAGE 1: COVER ---
  // Background subtle block
  doc.setFillColor(250, 249, 246);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Primary accent bar
  const pRgb = hexToRgbValues(colors.primary);
  doc.setFillColor(pRgb.r, pRgb.g, pRgb.b);
  doc.rect(margin, margin, 12, 12, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(24, 24, 27);
  doc.text(project.name, margin, margin + 26);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.text('Brand & Website Design System Specification', margin, margin + 35);

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, margin + 45, pageWidth - margin, margin + 45);

  let curY = margin + 58;

  // Metadata block
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);

  const metaRows = [
    ['Website Type', project.websiteType.name],
    ['Category', project.websiteType.category],
    ['Visual Direction', project.visualDirection.name],
    ['Brand Personality', `${project.brandPersonality.primary} (${project.brandPersonality.secondary.join(', ')})`],
    ['Primary Palette', colors.name],
    ['Typography Pairing', typography.name],
    ['Generated On', new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })]
  ];

  metaRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.text(label, margin, curY);
    doc.setFont('helvetica', 'normal');
    doc.text(value, margin + 48, curY);
    curY += 8;
  });

  // Business summary block
  curY += 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(margin, curY, contentWidth, 54, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 30, 30);
  doc.text('Business Overview & Core Mission', margin + 6, curY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const offeringLines = doc.splitTextToSize(`Offering: ${project.business.offering || 'Not specified'}`, contentWidth - 12);
  doc.text(offeringLines, margin + 6, curY + 18);

  const audienceLines = doc.splitTextToSize(`Target Audience: ${project.business.audience || 'Not specified'}`, contentWidth - 12);
  doc.text(audienceLines, margin + 6, curY + 30);

  const goalLines = doc.splitTextToSize(`Primary Website Goal: ${project.business.primaryGoal}`, contentWidth - 12);
  doc.text(goalLines, margin + 6, curY + 42);

  addFooter(1, 4);

  // --- PAGE 2: COLOR SYSTEM ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text('01. Color Palette & Semantic System', margin, margin + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Selected palette: ${colors.name} — ${colors.description}`,
    margin,
    margin + 16
  );

  let colorY = margin + 26;

  // Primary semantic swatches
  const swatches = [
    { label: 'Primary Brand', hex: colors.primary, role: 'Main CTA buttons, active accents, key links' },
    { label: 'Secondary Tone', hex: colors.secondary, role: 'Secondary buttons, dark text, footer backgrounds' },
    { label: 'Accent Highlight', hex: colors.accent, role: 'Badges, subtle indicators, hover glow' },
    { label: 'Canvas Background', hex: colors.background, role: 'Dominant 60% page background surface' },
    { label: 'Surface Container', hex: colors.surface, role: 'Cards, modals, input containers' },
    { label: 'Surface Border', hex: colors.surfaceBorder, role: 'Hairline 1px section & card dividers' },
    { label: 'Text Primary', hex: colors.textPrimary, role: 'Headlines, body copy, key titles' },
    { label: 'Text Secondary', hex: colors.textSecondary, role: 'Subtitles, supporting paragraphs, captions' }
  ];

  swatches.forEach(swatch => {
    const rgb = hexToRgbValues(swatch.hex);
    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, colorY, 14, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(swatch.label, margin + 20, colorY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 100, 100);
    doc.text(`${swatch.hex.toUpperCase()} · ${swatch.role}`, margin + 20, colorY + 11);

    colorY += 18;
  });

  // Shade Ramp Section
  colorY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Primary Color Shade Ramp (50 - 900)', margin, colorY);
  colorY += 8;

  const shadeKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
  const shadeWidth = contentWidth / 10;

  shadeKeys.forEach((key, idx) => {
    const hex = colors.shades[key];
    const rgb = hexToRgbValues(hex);
    const swatchX = margin + idx * shadeWidth;

    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.rect(swatchX, colorY, shadeWidth, 12, 'F');

    doc.setFontSize(7.5);
    doc.setTextColor(idx > 4 ? 255 : 30, idx > 4 ? 255 : 30, idx > 4 ? 255 : 30);
    doc.text(`${key}`, swatchX + 2, colorY + 8);
  });

  addFooter(2, 4);

  // --- PAGE 3: TYPOGRAPHY & LAYOUT ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text('02. Typography & Layout Specifications', margin, margin + 8);

  let typoY = margin + 22;

  // Fonts Box
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(230, 230, 230);
  doc.roundedRect(margin, typoY, contentWidth, 36, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 30, 30);
  doc.text(`Typography Pairing: ${typography.name}`, margin + 6, typoY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`Display & Headlines: ${typography.displayFont} (Weight: ${typography.headingWeight})`, margin + 6, typoY + 16);
  doc.text(`Body & Prose: ${typography.bodyFont} (Weight: ${typography.bodyWeight})`, margin + 6, typoY + 23);
  doc.text(`Data, Code & Numerals: ${typography.monoFont} (Tabular figures enabled)`, margin + 6, typoY + 30);

  typoY += 46;

  // Type Scale Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Modular Type Scale Hierarchy', margin, typoY);
  typoY += 8;

  const scaleRows = [
    { level: 'Hero Display', size: '48px / 3rem', weight: 'Bold 700', sample: 'Empowering Next-Gen Founders' },
    { level: 'H1 Section Heading', size: '36px / 2.25rem', weight: 'SemiBold 600', sample: 'Curated Studio Collections' },
    { level: 'H2 Feature Title', size: '24px / 1.5rem', weight: 'SemiBold 600', sample: 'Tactile Artisan Porcelain' },
    { level: 'H3 Card Header', size: '18px / 1.125rem', weight: 'Medium 500', sample: 'Handcrafted in Small Batches' },
    { level: 'Body Text', size: '15px / 0.9375rem', weight: 'Regular 400', sample: 'Designed for daily rituals with quiet tactile grace.' },
    { level: 'Muted Caption', size: '12px / 0.75rem', weight: 'Regular 400', sample: 'Dimensions: 14cm × 9cm · Stoneware glaze' }
  ];

  scaleRows.forEach(row => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(40, 40, 40);
    doc.text(row.level, margin, typoY);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(110, 110, 110);
    doc.text(row.size, margin + 45, typoY);

    doc.setTextColor(60, 60, 60);
    doc.text(row.sample, margin + 85, typoY);

    typoY += 9;
  });

  typoY += 10;
  // Layout and Spacing Guidelines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Layout, Spacing & Container Metrics', margin, typoY);
  typoY += 8;

  const layoutItems = [
    ['Canvas Density', `${project.layout.density.toUpperCase()} — Generous whitespace margins (2rem - 3rem) between content blocks`],
    ['Container Max Width', `${project.layout.containerWidth.toUpperCase()} — Baseline 1200px - 1440px desktop frame`],
    ['Card Corner Radius', `${project.layout.radius.toUpperCase()} — Consistent geometry across buttons, inputs, and cards`],
    ['Elevation & Shadows', `${project.layout.cardElevation.toUpperCase()} — Single-elevation depth with subtle 1px hairline dividers`],
    ['Button Styling', `${project.components.buttonStyle.toUpperCase()} with ${project.components.buttonSize} padding math`]
  ];

  layoutItems.forEach(([k, v]) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    doc.text(k, margin, typoY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(v, margin + 48, typoY);
    typoY += 8;
  });

  addFooter(3, 4);

  // --- PAGE 4: COMPONENTS & ACCESSIBILITY ---
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(24, 24, 27);
  doc.text('03. Component Library & Accessibility Audit', margin, margin + 8);

  let compY = margin + 22;

  // Accessibility Audit Summary
  const contrastAudit = auditContrast(colors.textPrimary, colors.background);
  const buttonAudit = auditContrast('#FFFFFF', colors.primary);

  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(225, 225, 225);
  doc.roundedRect(margin, compY, contentWidth, 38, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 30, 30);
  doc.text('Accessibility & WCAG 2.2 AA Compliance', margin + 6, compY + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(`Body Text on Canvas: ${contrastAudit.ratioFormatted} — ${contrastAudit.ratingDescription}`, margin + 6, compY + 16);
  doc.text(`White Text on Primary Button: ${buttonAudit.ratioFormatted} — ${buttonAudit.ratingDescription}`, margin + 6, compY + 23);
  doc.text(`Touch Target Minimum: 44px on mobile, 40px on desktop with visible :focus-visible rings`, margin + 6, compY + 30);

  compY += 48;

  // Enabled Components
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text('Configured Component Specifications', margin, compY);
  compY += 8;

  project.components.enabledComponents.forEach(componentId => {
    doc.setFillColor(245, 245, 245);
    doc.setDrawColor(230, 230, 230);
    doc.roundedRect(margin, compY, contentWidth, 14, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    doc.text(componentId.replace('-', ' ').toUpperCase(), margin + 6, compY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(110, 110, 110);
    doc.text(`Uses ${colors.name} tokens, ${project.layout.radius} radius, and ${typography.bodyFont} typography`, margin + 6, compY + 11);

    compY += 18;
  });

  // Handoff note at bottom
  compY += 4;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('This specification was generated by Design System Studio for seamless handoff to engineers and AI website builders.', margin, compY);

  addFooter(4, 4);

  // Save the PDF
  const filename = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_design_system.pdf`;
  doc.save(filename);
}

/**
 * Generates the Founder Handoff Brief in human-friendly Markdown
 */
export function generateFounderHandoffBrief(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);
  const contrastAudit = auditContrast(colors.textPrimary, colors.background);
  const buttonAudit = auditContrast('#FFFFFF', colors.primary);

  return `# Website Design System Specification & Founder Handoff Brief
**Project:** ${project.name}
**Website Category:** ${project.websiteType.name} (${project.websiteType.category})
**Visual Direction:** ${project.visualDirection.name}
**Date:** ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

---

## 1. Executive Summary & Brand Purpose
- **Business Offering:** ${project.business.offering || 'Not specified'}
- **Target Audience:** ${project.business.audience || 'Not specified'}
- **Primary Website Goal:** ${project.business.primaryGoal}
- **Brand Personality:** ${project.brandPersonality.primary} (Secondary: ${project.brandPersonality.secondary.join(', ')})
- **Aesthetic Feel:** ${project.visualDirection.aesthetic}

---

## 2. Color System
This design system uses a strict **60-30-10 distribution**:
- **60% Dominant Canvas:** \`${colors.background}\`
- **30% Structural Surfaces:** \`${colors.surface}\` with hairline borders \`${colors.surfaceBorder}\`
- **10% Accent Focus (CTAs & active states):** \`${colors.primary}\`

### Key Color Values
- **Primary Brand / Action:** \`${colors.primary}\`
- **Secondary Tone:** \`${colors.secondary}\`
- **Accent Highlight:** \`${colors.accent}\`
- **Background (Main):** \`${colors.background}\`
- **Background (Alternate):** \`${colors.backgroundAlt}\`
- **Surface / Cards:** \`${colors.surface}\`
- **Dividers & Borders:** \`${colors.surfaceBorder}\`
- **Text (Primary):** \`${colors.textPrimary}\`
- **Text (Secondary):** \`${colors.textSecondary}\`
- **Text (Muted):** \`${colors.textMuted}\`
- **Interactive Focus Outline:** \`${colors.focusRing}\`

### Primary Shade Ramp
| Shade | HEX Code |
| :--- | :--- |
| 50 | \`${colors.shades[50]}\` |
| 100 | \`${colors.shades[100]}\` |
| 200 | \`${colors.shades[200]}\` |
| 300 | \`${colors.shades[300]}\` |
| 400 | \`${colors.shades[400]}\` |
| 500 | \`${colors.shades[500]}\` |
| 600 | \`${colors.shades[600]}\` |
| 700 | \`${colors.shades[700]}\` |
| 800 | \`${colors.shades[800]}\` |
| 900 | \`${colors.shades[900]}\` |

---

## 3. Typography & Hierarchy
Follow the **2+1 Font Rule**:
- **Display & Headings:** \`${typography.displayFont}\` (Weight: ${typography.headingWeight})
- **Body & Prose:** \`${typography.bodyFont}\` (Weight: ${typography.bodyWeight})
- **Data & Telemetry:** \`${typography.monoFont}\` with \`font-variant-numeric: tabular-nums\`

### Scale Specifications
- **Hero Title:** 48px–56px / Line height 1.15 / \`text-wrap: balance\`
- **Section Heading (H1/H2):** 28px–36px / Line height 1.25
- **Sub-headings (H3):** 20px–24px / Line height 1.35
- **Body Text:** 15px–16px / Line height 1.6 / Max measure 65–75ch
- **Microcopy & Captions:** 12px–13px / Unboxed text with subtle \`·\` separators

---

## 4. Layout, Spacing & Components
- **Density:** ${project.layout.density} layout rhythm.
- **Container Width:** Standard 1200px–1440px desktop frame with $\\ge 16$px horizontal padding.
- **Corner Radius:** \`${project.layout.radius}\` radius scale across buttons, cards, and inputs.
- **Depth:** Single-elevation surface with 1px hairline border (\`${colors.surfaceBorder}\`). Never nest bordered cards inside larger bordered cards.
- **Button Padding:** Horizontal padding $\\approx 2\\times$ vertical padding (e.g., \`py-2.5 px-5\`).
- **Mobile Experience:** Mobile navigation uses \`${project.responsive.mobileNav}\`. Sticky elements capped at 15% mobile viewport height.

---

## 5. Accessibility & Contrast Verification
- **Text on Background:** Contrast ratio is **${contrastAudit.ratioFormatted}** (${contrastAudit.ratingDescription}).
- **Primary Button Text:** Contrast ratio is **${buttonAudit.ratioFormatted}** (${buttonAudit.ratingDescription}).
- **Touch Targets:** Minimum 44px on mobile and 40px on desktop. Visible focus rings required.

*Generated with Design System Studio.*
`;
}

/**
 * Generates the AI Website-Builder Prompt for Claude / Gemini / Cursor / v0
 */
export function generateAiWebsitePrompt(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  return `You are building a production-grade website for "${project.name}", a ${project.websiteType.name}.
You must strictly follow the verified Design System tokens and rules provided below. DO NOT invent contrasting colors, arbitrary fonts, or clashing layout values.

### Business & Audience Context
- Website Name: ${project.name}
- Category: ${project.websiteType.name} (${project.websiteType.category})
- Offering: ${project.business.offering || 'Professional service'}
- Target Audience: ${project.business.audience || 'Target customers'}
- Primary Goal: ${project.business.primaryGoal}
- Brand Personality: ${project.brandPersonality.primary} (${project.brandPersonality.secondary.join(', ')})
- Visual Direction: ${project.visualDirection.name} — ${project.visualDirection.description}

### Verified Design Tokens
1. Color Palette (Strict 60-30-10 distribution):
   - Dominant Canvas Background (60%): "${colors.background}"
   - Alternate Section Background: "${colors.backgroundAlt}"
   - Surface / Card Background (30%): "${colors.surface}"
   - Hairline Border / Dividers: "${colors.surfaceBorder}"
   - Primary Brand / CTA Color (10%): "${colors.primary}"
   - Secondary Brand Tone: "${colors.secondary}"
   - Accent Tone: "${colors.accent}"
   - Text Primary: "${colors.textPrimary}"
   - Text Secondary: "${colors.textSecondary}"
   - Text Muted: "${colors.textMuted}"
   - Focus Ring: "${colors.focusRing}"

2. Typography Guidelines:
   - Display / Headline Font: "${typography.displayFont}", sans-serif (Weight: ${typography.headingWeight})
   - Body Prose Font: "${typography.bodyFont}", sans-serif (Weight: ${typography.bodyWeight})
   - Code & Data Font: "${typography.monoFont}", monospace with tabular-nums
   - Scale: clamp(2.25rem, 4vw, 3.5rem) for hero title with text-wrap: balance; 15px-16px for body prose.

3. Layout & Geometry:
   - Density: ${project.layout.density} spacing (minimum section padding 4rem-6rem).
   - Container Max Width: 1200px - 1440px desktop frame.
   - Corner Radius: ${project.layout.radius} across buttons, cards, and input controls.
   - Elevation: Flat or single-elevation depth with 1px subtle hairline border; no nested bordered cards inside cards.
   - Button Padding: py-2.5 px-5 (${project.components.buttonStyle} style).

4. Anti-Slop Discipline:
   - NO static pill badge enclosures for metadata (use clean unboxed text separated by ·).
   - NO mechanical comment headers (like "// 01 ARCHITECTURE" or ">_ RUN").
   - NO fake innovation scores or telemetry tickers in footers.
   - NO thick left accent borders on cards.
   - All interactive buttons must have genuine onClick handlers or forms.
   - Ensure WCAG AA contrast (minimum 4.5:1 text, 3:1 for large headlines).

5. Component Pack to Implement:
   ${project.components.enabledComponents.map(c => `- ${c}`).join('\n   ')}

Build the website cleanly in React with Tailwind CSS applying these exact tokens.`;
}

/**
 * Generates standard W3C Design Tokens JSON
 */
export function generateJsonTokens(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  const tokenStructure = {
    $name: project.name,
    $version: '1.0.0',
    color: {
      brand: {
        primary: { $value: colors.primary, $type: 'color' },
        secondary: { $value: colors.secondary, $type: 'color' },
        accent: { $value: colors.accent, $type: 'color' }
      },
      canvas: {
        background: { $value: colors.background, $type: 'color' },
        backgroundAlt: { $value: colors.backgroundAlt, $type: 'color' },
        surface: { $value: colors.surface, $type: 'color' },
        border: { $value: colors.surfaceBorder, $type: 'color' }
      },
      text: {
        primary: { $value: colors.textPrimary, $type: 'color' },
        secondary: { $value: colors.textSecondary, $type: 'color' },
        muted: { $value: colors.textMuted, $type: 'color' },
        link: { $value: colors.link, $type: 'color' }
      },
      shades: Object.fromEntries(
        Object.entries(colors.shades).map(([k, v]) => [k, { $value: v, $type: 'color' }])
      )
    },
    typography: {
      fontFamily: {
        display: { $value: [typography.displayFont, 'sans-serif'], $type: 'fontFamily' },
        body: { $value: [typography.bodyFont, 'sans-serif'], $type: 'fontFamily' },
        mono: { $value: [typography.monoFont, 'monospace'], $type: 'fontFamily' }
      },
      fontWeight: {
        heading: { $value: typography.headingWeight, $type: 'fontWeight' },
        body: { $value: typography.bodyWeight, $type: 'fontWeight' }
      }
    },
    geometry: {
      radius: { $value: project.layout.radius, $type: 'dimension' },
      density: { $value: project.layout.density, $type: 'string' }
    }
  };

  return JSON.stringify(tokenStructure, null, 2);
}

/**
 * Generates CSS Custom Properties
 */
export function generateCssVariables(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);
  const darkSemantic = project.tokens?.color?.semantic?.dark;

  return `:root {
  /* Brand & Theme Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};

  /* Surfaces & Backgrounds */
  --color-bg: ${colors.background};
  --color-bg-alt: ${colors.backgroundAlt};
  --color-surface: ${colors.surface};
  --color-border: ${colors.surfaceBorder};

  /* Typography Colors */
  --color-text-primary: ${colors.textPrimary};
  --color-text-secondary: ${colors.textSecondary};
  --color-text-muted: ${colors.textMuted};
  --color-link: ${colors.link};
  --color-focus: ${colors.focusRing};

  /* Primary Shades */
  --color-primary-50: ${colors.shades[50]};
  --color-primary-100: ${colors.shades[100]};
  --color-primary-200: ${colors.shades[200]};
  --color-primary-300: ${colors.shades[300]};
  --color-primary-400: ${colors.shades[400]};
  --color-primary-500: ${colors.shades[500]};
  --color-primary-600: ${colors.shades[600]};
  --color-primary-700: ${colors.shades[700]};
  --color-primary-800: ${colors.shades[800]};
  --color-primary-900: ${colors.shades[900]};

  /* Fonts */
  --font-display: "${typography.displayFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-body: "${typography.bodyFont}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-mono: "${typography.monoFont}", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Corner Radius */
  --radius-sm: ${project.layout.radius === 'sharp' ? '0px' : project.layout.radius === 'subtle' ? '4px' : '8px'};
  --radius-md: ${project.layout.radius === 'sharp' ? '0px' : project.layout.radius === 'subtle' ? '6px' : '12px'};
  --radius-lg: ${project.layout.radius === 'sharp' ? '0px' : project.layout.radius === 'subtle' ? '8px' : '16px'};
}

.dark {
  /* Dark Mode Surfaces & Backgrounds */
  --color-bg: ${darkSemantic?.bgDefault || '#0A0A0A'};
  --color-bg-alt: ${darkSemantic?.bgSurface || '#141414'};
  --color-surface: ${darkSemantic?.bgSurface || '#141414'};
  --color-border: ${darkSemantic?.borderDefault || '#262626'};

  /* Dark Mode Typography Colors */
  --color-text-primary: ${darkSemantic?.fgDefault || '#FAFAFA'};
  --color-text-secondary: ${darkSemantic?.fgMuted || '#A3A3A3'};
  --color-text-muted: ${darkSemantic?.fgMuted || '#737373'};
  --color-link: ${darkSemantic?.actionPrimary || colors.primary};
  --color-focus: ${darkSemantic?.focusRing || colors.focusRing};
}
`;
}

/**
 * Generates Tailwind CSS config snippet
 */
export function generateTailwindConfig(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${colors.primary}',
          50: '${colors.shades[50]}',
          100: '${colors.shades[100]}',
          200: '${colors.shades[200]}',
          300: '${colors.shades[300]}',
          400: '${colors.shades[400]}',
          500: '${colors.shades[500]}',
          600: '${colors.shades[600]}',
          700: '${colors.shades[700]}',
          800: '${colors.shades[800]}',
          900: '${colors.shades[900]}'
        },
        brand: {
          secondary: '${colors.secondary}',
          accent: '${colors.accent}'
        },
        surface: {
          DEFAULT: '${colors.surface}',
          border: '${colors.surfaceBorder}'
        },
        canvas: {
          DEFAULT: '${colors.background}',
          alt: '${colors.backgroundAlt}'
        }
      },
      fontFamily: {
        display: ['"${typography.displayFont}"', 'sans-serif'],
        body: ['"${typography.bodyFont}"', 'sans-serif'],
        mono: ['"${typography.monoFont}"', 'monospace']
      }
    }
  }
};
`;
}

const q = (v: unknown): string => JSON.stringify(String(v ?? ''));

/**
 * Generates TypeScript token constants
 */
export function generateTypeScriptDefinitions(project: DesignProject): string {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  return `export const DESIGN_TOKENS = {
  projectName: ${q(project.name)},
  colors: {
    primary: ${q(colors.primary)},
    secondary: ${q(colors.secondary)},
    accent: ${q(colors.accent)},
    background: ${q(colors.background)},
    backgroundAlt: ${q(colors.backgroundAlt)},
    surface: ${q(colors.surface)},
    surfaceBorder: ${q(colors.surfaceBorder)},
    textPrimary: ${q(colors.textPrimary)},
    textSecondary: ${q(colors.textSecondary)},
    textMuted: ${q(colors.textMuted)},
    focusRing: ${q(colors.focusRing)},
    shades: ${JSON.stringify(colors.shades, null, 4)}
  },
  typography: {
    displayFont: ${q(typography.displayFont)},
    headingFont: ${q(typography.headingFont)},
    bodyFont: ${q(typography.bodyFont)},
    monoFont: ${q(typography.monoFont)},
    scaleRatio: ${project.typography.scaleRatio}
  },
  layout: {
    density: ${q(project.layout.density)},
    radius: ${q(project.layout.radius)},
    cardElevation: ${q(project.layout.cardElevation)}
  }
} as const;

export type DesignTokens = typeof DESIGN_TOKENS;
`;
}

/**
 * Packages all developer and founder assets into a single ZIP file
 */
export async function downloadDeveloperZip(project: DesignProject): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  const folderName = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_design_system`;
  const folder = zip.folder(folderName) || zip;

  folder.file('README.md', generateFounderHandoffBrief(project));
  folder.file('ai_website_prompt.txt', generateAiWebsitePrompt(project));
  folder.file('tokens.json', generateJsonTokens(project));
  folder.file('variables.css', generateCssVariables(project));
  folder.file('tailwind.config.js', generateTailwindConfig(project));
  folder.file('tokens.ts', generateTypeScriptDefinitions(project));
  folder.file('project_backup.json', JSON.stringify(project, null, 2));

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
}

/**
 * Generates and downloads a clean Visual Design System Board image (PNG)
 */
export function downloadVisualBoardPng(project: DesignProject): void {
  const colors = getResolvedProjectColors(project);
  const typography = getResolvedProjectTypography(project);

  const canvas = document.createElement('canvas');
  canvas.width = 1600;
  canvas.height = 1000;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, 1600, 1000);

  // Top header bar
  ctx.fillStyle = colors.surface;
  ctx.fillRect(40, 40, 1520, 90);
  ctx.strokeStyle = colors.surfaceBorder;
  ctx.lineWidth = 1;
  ctx.strokeRect(40, 40, 1520, 90);

  // Wordmark
  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(project.name, 70, 95);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = '16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`${project.websiteType.name} · Design System Board`, 70, 118);

  // Swatches section
  ctx.fillStyle = colors.surface;
  ctx.fillRect(40, 160, 720, 400);
  ctx.strokeRect(40, 160, 720, 400);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Color Architecture', 70, 205);

  const swatchItems = [
    { label: 'Primary Brand', hex: colors.primary },
    { label: 'Secondary Tone', hex: colors.secondary },
    { label: 'Accent Highlight', hex: colors.accent },
    { label: 'Background Canvas', hex: colors.background },
    { label: 'Surface Container', hex: colors.surface },
    { label: 'Text Primary', hex: colors.textPrimary }
  ];

  swatchItems.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 70 + col * 220;
    const y = 230 + row * 140;

    ctx.fillStyle = c.hex;
    ctx.fillRect(x, y, 64, 64);
    ctx.strokeStyle = colors.surfaceBorder;
    ctx.strokeRect(x, y, 64, 64);

    ctx.fillStyle = colors.textPrimary;
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillText(c.label, x + 76, y + 26);

    ctx.fillStyle = colors.textMuted;
    ctx.font = '13px monospace';
    ctx.fillText(c.hex.toUpperCase(), x + 76, y + 48);
  });

  // Typography Section
  ctx.fillStyle = colors.surface;
  ctx.fillRect(800, 160, 760, 400);
  ctx.strokeRect(800, 160, 760, 400);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`Typography: ${typography.name}`, 830, 205);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = `bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText('Hero Display Headline', 830, 265);

  ctx.font = `600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText('Section Headline & Product Category', 830, 315);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = `16px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
  ctx.fillText('Body prose crafted for maximum legibility and comfort across devices.', 830, 360);
  ctx.fillText('Optimal reading measure between 65 and 75 characters with balanced line heights.', 830, 388);

  ctx.fillStyle = colors.textMuted;
  ctx.font = `14px monospace`;
  ctx.fillText(`Tabular Figures: $1,280.00 · 99.98% Latency · 04:32:10`, 830, 435);

  // Bottom interactive components preview
  ctx.fillStyle = colors.surface;
  ctx.fillRect(40, 590, 1520, 370);
  ctx.strokeRect(40, 590, 1520, 370);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Component Gallery & Interaction States', 70, 635);

  // Button previews
  // Primary CTA
  ctx.fillStyle = colors.primary;
  ctx.fillRect(70, 670, 180, 48);
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Primary Action', 160, 700);
  ctx.textAlign = 'left';

  // Secondary Button
  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = colors.surfaceBorder;
  ctx.strokeRect(280, 670, 180, 48);
  ctx.fillStyle = colors.textPrimary;
  ctx.textAlign = 'center';
  ctx.fillText('Secondary Button', 370, 700);
  ctx.textAlign = 'left';

  // Card preview
  ctx.fillStyle = colors.backgroundAlt;
  ctx.fillRect(500, 670, 440, 240);
  ctx.strokeStyle = colors.surfaceBorder;
  ctx.strokeRect(500, 670, 440, 240);

  ctx.fillStyle = colors.textPrimary;
  ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText('Featured Component Card', 530, 715);

  ctx.fillStyle = colors.textSecondary;
  ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.fillText(`Tailored for ${project.websiteType.name} with ${project.layout.radius} radius.`, 530, 745);

  // Download the canvas
  const downloadUrl = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_design_board.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function hexToRgbValues(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16)
    };
  }
  return {
    r: parseInt(clean.substring(0, 2), 16) || 0,
    g: parseInt(clean.substring(2, 4), 16) || 0,
    b: parseInt(clean.substring(4, 6), 16) || 0
  };
}

/**
 * Generates Next.js 15 App Router root layout (app/layout.tsx)
 */
export function generateNextJsLayout(project: DesignProject): string {
  const typography = getResolvedProjectTypography(project);
  const families = Array.from(new Set([typography.displayFont, typography.bodyFont, typography.monoFont].filter(Boolean)))
    .map(f => `family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400..800`)
    .join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${families}&display=swap`;

  return `import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '${project.name} — ${project.websiteType.name}',
  description: '${project.business.offering ? project.business.offering.replace(/'/g, "\\'") : 'Website built with Design System Studio.'}',
  openGraph: {
    title: '${project.name}',
    description: '${project.business.offering ? project.business.offering.replace(/'/g, "\\'") : 'Built with Design System Studio.'}',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="${project.accessibility.defaultTheme === 'dark' ? 'dark' : ''}">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="${googleFontsUrl}"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)] font-body selection:bg-neutral-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
`;
}

/**
 * Generates Next.js 15 App Router homepage (app/page.tsx)
 */
export function generateNextJsPage(project: DesignProject): string {
  return `export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      {/* Top Bar */}
      <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <span className="font-display font-bold text-lg tracking-tight">
          ${project.name}
        </span>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--color-text-secondary)]">
          <a href="#about" className="hover:text-[var(--color-text-primary)] transition-colors">About</a>
          <a href="#features" className="hover:text-[var(--color-text-primary)] transition-colors">Features</a>
          <a href="#contact" className="hover:text-[var(--color-text-primary)] transition-colors">Contact</a>
        </nav>
        <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-primary)] mb-3 inline-block">
          ${project.visualDirection.name}
        </span>
        <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-6 leading-tight text-balance">
          ${project.business.offering ? project.business.offering.split('.')[0] : `Welcome to ${project.name}`}
        </h1>
        <p className="text-base text-[var(--color-text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
          ${project.business.audience ? `Crafted specifically for ${project.business.audience}.` : 'Experience seamless design built on verified tokens.'}
        </p>
        <div className="flex items-center justify-center gap-4">
          <button className="px-6 py-3 text-sm font-semibold rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity shadow-sm">
            ${project.business.primaryGoal ? project.business.primaryGoal.split(' ')[0] : 'Explore'} Now
          </button>
        </div>
      </section>
    </main>
  );
}
`;
}

/**
 * Downloads a complete Next.js 15 App Router Starter ZIP
 */
export async function downloadNextJsStarterZip(project: DesignProject): Promise<void> {
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();
  const folderName = `${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_nextjs_app`;
  const folder = zip.folder(folderName) || zip;

  const appFolder = folder.folder('app') || folder;
  appFolder.file('layout.tsx', generateNextJsLayout(project));
  appFolder.file('page.tsx', generateNextJsPage(project));
  appFolder.file('globals.css', generateCssVariables(project));

  folder.file('tailwind.config.js', generateTailwindConfig(project));
  folder.file('package.json', JSON.stringify({
    name: folderName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint'
    },
    dependencies: {
      next: '^15.1.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'lucide-react': '^0.546.0'
    },
    devDependencies: {
      typescript: '^5.7.0',
      '@types/node': '^22.0.0',
      '@types/react': '^19.0.0',
      '@types/react-dom': '^19.0.0',
      tailwindcss: '^3.4.17',
      autoprefixer: '^10.4.20',
      postcss: '^8.4.49'
    }
  }, null, 2));

  folder.file('README.md', `# ${project.name} — Next.js 15 Web Application
Built with **Design System Studio**.

## Quick Start
\`\`\`bash
npm install
npm run dev
\`\`\`
Visit http://localhost:3000 to see your website with verified design system tokens.
`);

  const content = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(content);

  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${folderName}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(downloadUrl);
}

