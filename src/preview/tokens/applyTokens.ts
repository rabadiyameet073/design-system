import { DesignTokens } from '../../tokens/types';
import { tokensToCssVars } from '../../tokens/tokensToCssVars';

let activeFontLink: HTMLLinkElement | null = null;

/**
 * Injects Google Fonts stylesheet into the document head for the active typography roles.
 */
function updateFontStylesheets(tokens: DesignTokens) {
  if (typeof document === 'undefined') return;

  const roles = tokens.typography.roles;
  const families = new Set<string>();

  Object.values(roles).forEach((role) => {
    if (role && role.family && role.family !== 'inherit' && role.family !== 'sans-serif' && role.family !== 'serif' && role.family !== 'monospace') {
      families.add(role.family.trim());
    }
  });

  if (families.size === 0) {
    if (activeFontLink) {
      activeFontLink.remove();
      activeFontLink = null;
    }
    return;
  }

  // Construct Google Fonts URL with wght 400;500;600;700 & display=swap
  const familyQueries = Array.from(families).map((f) => {
    const encoded = encodeURIComponent(f).replace(/%20/g, '+');
    return `family=${encoded}:wght@400;500;600;700`;
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
  }
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
    document.body.style.backgroundColor = vars['--color-bg-default'] || (mode === 'dark' ? '#090D16' : '#FAF9F6');
    document.body.style.color = vars['--color-fg-default'] || (mode === 'dark' ? '#F8FAFC' : '#18181B');
    document.body.style.fontFamily = `var(--font-body, system-ui, sans-serif)`;
  }

  // 3. Update fonts link
  updateFontStylesheets(tokens);
}
