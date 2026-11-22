import crypto from 'crypto';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'oauth2' | 'custom' | 'demo';
  authenticatedAt: number;
}

export interface OAuthStatePayload {
  state: string;
  codeVerifier: string;
  provider: string;
  targetOrigin: string;
  exp: number;
}

const SESSION_COOKIE_NAME = 'dss_session';
const OAUTH_STATE_COOKIE_NAME = 'dss_oauth_state';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dss_session_fallback_secret_for_local_development_only';
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function signData(data: string, secret = SESSION_SECRET): string {
  return crypto.createHmac('sha256', secret).update(data).digest('base64url');
}

export function createSessionToken(user: SessionUser): string {
  const payload = JSON.stringify({
    ...user,
    exp: Date.now() + SESSION_MAX_AGE_MS
  });
  const b64 = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = signData(b64);
  return `${b64}.${sig}`;
}

export function verifySessionToken(token: string): SessionUser | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expectedSig = signData(b64);
  try {
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const raw = Buffer.from(b64, 'base64url').toString('utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.exp || Date.now() > parsed.exp) {
      return null;
    }
    const { exp, ...user } = parsed;
    return user as SessionUser;
  } catch {
    return null;
  }
}

export function createOAuthState(provider: string, targetOrigin: string): { state: string; codeChallenge: string; cookieValue: string } {
  const state = crypto.randomBytes(24).toString('base64url');
  const codeVerifier = crypto.randomBytes(32).toString('base64url');
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url');

  const payload = JSON.stringify({
    state,
    codeVerifier,
    provider,
    targetOrigin,
    exp: Date.now() + 10 * 60 * 1000 // 10 minutes
  });
  const b64 = Buffer.from(payload, 'utf8').toString('base64url');
  const sig = signData(b64);

  return {
    state,
    codeChallenge,
    cookieValue: `${b64}.${sig}`
  };
}

export function verifyOAuthState(cookieToken: string, returnedState: string): OAuthStatePayload | null {
  if (!cookieToken || !returnedState) return null;
  const parts = cookieToken.split('.');
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  const expectedSig = signData(b64);
  try {
    const sigBuf = Buffer.from(sig);
    const expBuf = Buffer.from(expectedSig);
    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      return null;
    }
    const parsed: OAuthStatePayload = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (!parsed.exp || Date.now() > parsed.exp) return null;
    if (parsed.state !== returnedState) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parseCookies(cookieHeader?: string): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const idx = pair.indexOf('=');
    if (idx < 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    try {
      cookies[key] = decodeURIComponent(val);
    } catch {
      cookies[key] = val;
    }
  }
  return cookies;
}

export function setSessionCookie(res: any, token: string, isProduction = process.env.NODE_ENV === 'production'): void {
  const secureFlag = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800${secureFlag}`
  );
}

export function clearSessionCookie(res: any, isProduction = process.env.NODE_ENV === 'production'): void {
  const secureFlag = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureFlag}`
  );
}

export function setOAuthStateCookie(res: any, token: string, isProduction = process.env.NODE_ENV === 'production'): void {
  const secureFlag = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${OAUTH_STATE_COOKIE_NAME}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=600${secureFlag}`
  );
}

export function clearOAuthStateCookie(res: any, isProduction = process.env.NODE_ENV === 'production'): void {
  const secureFlag = isProduction ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${OAUTH_STATE_COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secureFlag}`
  );
}

export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export { SESSION_COOKIE_NAME, OAUTH_STATE_COOKIE_NAME };
