import { DesignTokens } from '../tokens/types';
import { DesignTokensSchema } from '../tokens/types';

export type StudioView = 'landing' | 'wizard' | 'dashboard' | 'workspace' | 'share';

export interface RouteState {
  view: StudioView;
  projectId?: string;
  step?: number;
  shareData?: string;
}

/**
 * Encodes design tokens into a safe base64 URL string for instant shareable previews
 */
export function createShareableUrl(tokens: DesignTokens): string {
  try {
    const jsonStr = JSON.stringify(tokens);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    return `${origin}${pathname}#/share?data=${encodeURIComponent(base64)}`;
  } catch (err) {
    console.error('Failed to create shareable URL:', err);
    return '';
  }
}

/**
 * Decodes and validates tokens from a shareable URL data string
 */
export function decodeShareableData(encodedData: string): DesignTokens | null {
  try {
    const rawBase64 = decodeURIComponent(encodedData);
    const jsonStr = decodeURIComponent(atob(rawBase64));
    const parsed = JSON.parse(jsonStr);
    const validation = DesignTokensSchema.safeParse(parsed);
    if (validation.success) {
      return validation.data as DesignTokens;
    }
    console.warn('Shareable tokens failed validation:', validation.error);
    return null;
  } catch (err) {
    console.error('Failed to decode shareable token data:', err);
    return null;
  }
}

/**
 * Parses window.location.hash into a typed RouteState object.
 *
 * Supported patterns:
 * - #/ or "" or #/landing           => { view: 'landing' }
 * - #/dashboard                     => { view: 'dashboard' }
 * - #/workspace                     => { view: 'workspace' }
 * - #/share?data=...                => { view: 'share', shareData: '...' }
 * - #/project/:id/workspace         => { view: 'workspace', projectId: ':id' }
 * - #/project/:id/step/:step        => { view: 'wizard', projectId: ':id', step: :step }
 * - #/project/:id/wizard/:step      => { view: 'wizard', projectId: ':id', step: :step }
 * - #/wizard/:step                  => { view: 'wizard', step: :step }
 * - #/wizard                        => { view: 'wizard' }
 */
export function parseHashRoute(hashString: string = window.location.hash): RouteState {
  const clean = (hashString || '').replace(/^#\/?/, '').trim();

  if (!clean || clean === 'landing') {
    return { view: 'landing' };
  }

  if (clean === 'dashboard') {
    return { view: 'dashboard' };
  }

  if (clean === 'workspace') {
    return { view: 'workspace' };
  }

  if (clean === 'wizard') {
    return { view: 'wizard' };
  }

  // Handle Shareable hosted preview route: #/share?data=...
  if (clean.startsWith('share')) {
    const queryIdx = clean.indexOf('?');
    if (queryIdx !== -1) {
      const queryString = clean.substring(queryIdx + 1);
      const params = new URLSearchParams(queryString);
      const shareData = params.get('data') || undefined;
      return { view: 'share', shareData };
    }
    return { view: 'share' };
  }

  const parts = clean.split('/').map(decodeURIComponent);

  // #/wizard/:step
  if (parts[0] === 'wizard' && parts[1]) {
    const stepNum = parseInt(parts[1], 10);
    return {
      view: 'wizard',
      step: Number.isFinite(stepNum) && stepNum >= 1 && stepNum <= 11 ? stepNum : 1
    };
  }

  // #/project/:id/...
  if (parts[0] === 'project' && parts[1]) {
    const projectId = parts[1];
    const subRoute = parts[2];
    const subParam = parts[3];

    if (subRoute === 'workspace') {
      return { view: 'workspace', projectId };
    }

    if (subRoute === 'step' || subRoute === 'wizard') {
      const stepNum = subParam ? parseInt(subParam, 10) : 1;
      return {
        view: 'wizard',
        projectId,
        step: Number.isFinite(stepNum) && stepNum >= 1 && stepNum <= 11 ? stepNum : 1
      };
    }

    // Default to wizard if just #/project/:id
    return { view: 'wizard', projectId, step: 1 };
  }

  // Fallback to landing if unknown
  return { view: 'landing' };
}

/**
 * Builds a valid hash string for the specified route state.
 */
export function formatHashRoute(route: RouteState): string {
  switch (route.view) {
    case 'landing':
      return '#/';
    case 'dashboard':
      return '#/dashboard';
    case 'share':
      return route.shareData ? `#/share?data=${encodeURIComponent(route.shareData)}` : '#/share';
    case 'workspace':
      return route.projectId
        ? `#/project/${encodeURIComponent(route.projectId)}/workspace`
        : '#/workspace';
    case 'wizard':
      if (route.projectId) {
        const step = route.step && route.step >= 1 && route.step <= 11 ? route.step : 1;
        return `#/project/${encodeURIComponent(route.projectId)}/step/${step}`;
      }
      return route.step ? `#/wizard/${route.step}` : '#/wizard';
    default:
      return '#/';
  }
}

/**
 * Programmatically navigates to a hash route.
 */
export function navigateToRoute(route: RouteState, replace: boolean = false): void {
  if (typeof window === 'undefined') return;
  const targetHash = formatHashRoute(route);
  if (window.location.hash === targetHash) return;

  if (replace) {
    const url = new URL(window.location.href);
    url.hash = targetHash;
    window.history.replaceState({}, '', url.toString());
  } else {
    window.location.hash = targetHash;
  }
}
