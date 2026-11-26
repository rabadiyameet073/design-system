import { DesignTokens } from '../../tokens/types';
import { tokensToCssVars } from '../../tokens/tokensToCssVars';

let activeFontLink: HTMLLinkElement | null = null;
let fontLoadDebounceTimer: ReturnType<typeof setTimeout> | null = null;

/**
 * Injects Google Fonts stylesheet into the document head for the active typography roles,
 * requesting only needed families and weights, with 150ms debounce and document.fonts.load()
 * preloading to eliminate FOUT flash per Doc 03 §4 & §12.
 */
function updateFontStylesheets(tokens: DesignTokens) {
  if (typeof document === 'undefined') return;

  const roles = tokens?.typography?.roles;
  if (!roles) return;

  // Collect distinct families and their specific required weights
  const familyWeightsMap = new Map<string, Set<number>>();

  Object.entries(roles).forEach(([roleName, role]) => {
    if (
      role &&
      role.family &&
      role.family !== 'inherit' &&
      role.family !== 'sans-serif' &&
      role.family !== 'serif' &&
      role.family !== 'monospace'
    ) {
      const fam = role.family.trim();
      if (!familyWeightsMap.has(fam)) {
        familyWeightsMap.set(fam, new Set<number>());
      }
      const weightSet = familyWeightsMap.get(fam)!;
      if (role.weight) weightSet.add(role.weight);

      // Body role standardly needs 400 and 700
      if (roleName === 'body') {
        weightSet.add(400);
        weightSet.add(700);
      }
      // Heading role standardly needs 600 and 700
      if (roleName === 'heading' || roleName === 'display') {
        weightSet.add(600);
        weightSet.add(700);
      }
    }
  });

  // Ensure non-latin script Google Fonts are reliably loaded with complete glyph subsets
  const scripts = tokens?.meta?.scripts || [];
  const activeScript = ((tokens?.meta as any)?.activeScript || scripts.find(s => s.toLowerCase() !== 'latin') || '').toLowerCase();
  if (activeScript === 'gujarati') {
    if (!familyWeightsMap.has('Noto Sans Gujarati')) {
      familyWeightsMap.set('Noto Sans Gujarati', new Set([400, 500, 600, 700]));
    }
    if (!familyWeightsMap.has('Noto Serif Gujarati')) {
      familyWeightsMap.set('Noto Serif Gujarati', new Set([600, 700]));
    }
  } else if (activeScript === 'devanagari') {
    if (!familyWeightsMap.has('Noto Sans Devanagari')) {
      familyWeightsMap.set('Noto Sans Devanagari', new Set([400, 500, 600, 700]));
    }
    if (!familyWeightsMap.has('Poppins')) {
      familyWeightsMap.set('Poppins', new Set([400, 600, 700]));
    }
  } else if (activeScript === 'arabic') {
    if (!familyWeightsMap.has('Cairo')) {
      familyWeightsMap.set('Cairo', new Set([400, 600, 700]));
    }
    if (!familyWeightsMap.has('Amiri')) {
      familyWeightsMap.set('Amiri', new Set([400, 700]));
    }
  }

  if (familyWeightsMap.size === 0) {
    if (activeFontLink) {
      activeFontLink.remove();
      activeFontLink = null;
    }
    return;
  }

  // Clear pending debounce timer
  if (fontLoadDebounceTimer) {
    clearTimeout(fontLoadDebounceTimer);
  }

  // Debounce by 150ms to prevent thrashing during fast hover exploration
  fontLoadDebounceTimer = setTimeout(() => {
    // Construct Google Fonts query with exact needed weights & display=swap
    const familyQueries: string[] = [];
    familyWeightsMap.forEach((weightsSet, fam) => {
      const sortedWeights = Array.from(weightsSet).sort((a, b) => a - b);
      const encoded = encodeURIComponent(fam).replace(/%20/g, '+');
      if (sortedWeights.length > 0) {
        familyQueries.push(`family=${encoded}:wght@${sortedWeights.join(';')}`);
      } else {
        familyQueries.push(`family=${encoded}:wght@400;600;700`);
      }
    });

    const fontUrl = `https://fonts.googleapis.com/css2?${familyQueries.join('&')}&display=swap`;

    if (!activeFontLink) {
      activeFontLink = document.createElement('link');
      activeFontLink.rel = 'stylesheet';
      activeFontLink.id = 'dss-preview-google-fonts';
      document.head.appendChild(activeFontLink);
    }

    if (activeFontLink.href !== fontUrl) {
      activeFontLink.href = fontUrl;

      // Preload critical weights to avoid FOUT flash per Doc 03 §4
      if (typeof document.fonts !== 'undefined' && document.fonts.load) {
        familyWeightsMap.forEach((weightsSet, fam) => {
          const sampleWeight = Array.from(weightsSet)[0] || 400;
          document.fonts.load(`${sampleWeight} 1rem "${fam}"`).catch(() => {
            // Ignore if font is still fetching
          });
        });
      }
    }
  }, 150);
}

/**
 * Applies DesignTokens as CSS custom properties to the document root,
 * updates theme class (light/dark), and injects web fonts.
 */
export function applyTokens(tokens: DesignTokens, mode: 'light' | 'dark' = 'light') {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // 1. Toggle dark class and data-theme attribute
  if (mode === 'dark') {
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
  } else {
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
  }

  // 2. Generate and set CSS custom properties
  const vars = tokensToCssVars(tokens, mode);
  for (const [key, val] of Object.entries(vars)) {
    root.style.setProperty(key, val);
  }

  // Set standard base background and text color directly on body
  if (document.body) {
    document.body.style.backgroundColor = vars['--color-bg-default'] || 'var(--color-bg-default)';
    document.body.style.color = vars['--color-fg-default'] || 'var(--color-fg-default)';
    document.body.style.fontFamily = `var(--font-body, system-ui, sans-serif)`;
  }

  // 3. Update fonts link
  updateFontStylesheets(tokens);
}

