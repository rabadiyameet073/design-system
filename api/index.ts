import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import {
  SessionUser,
  createSessionToken,
  verifySessionToken,
  createOAuthState,
  verifyOAuthState,
  parseCookies,
  setSessionCookie,
  clearSessionCookie,
  setOAuthStateCookie,
  clearOAuthStateCookie,
  escapeHtml,
  SESSION_COOKIE_NAME,
  OAUTH_STATE_COOKIE_NAME
} from './session';
import { generateInitialsAvatar } from '../src/utils/avatar';
import { projectStore, checkSharedRateLimit } from './projectStore';

export type UserSession = SessionUser;

export function getRedirectUri(req: express.Request): string {
  const appUrl = process.env.APP_URL;
  if (appUrl && appUrl !== 'MY_APP_URL' && appUrl.startsWith('http')) {
    return `${appUrl.replace(/\/$/, '')}/auth/callback`;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/auth/callback`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}/auth/callback`;
  }
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
  return `${protocol}://${host}/auth/callback`;
}

export function getTargetOrigin(req: express.Request): string {
  const redirectUri = getRedirectUri(req);
  try {
    return new URL(redirectUri).origin;
  } catch {
    return 'http://localhost:3000';
  }
}

export const app = express();

// Trust proxy for proper IP resolution on Vercel / Cloud Run per S9
app.set('trust proxy', 1);

// Limit JSON payload size to 100kb default per S11 (raised only where explicitly needed)
app.use(express.json({ limit: '100kb' }));

// Security headers middleware per S10 & Doc 05 §2
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://accounts.google.com https://oauth2.googleapis.com; frame-src 'self' https://accounts.google.com; frame-ancestors 'self';"
  );
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Safe IP extraction helper per S9
function getClientIp(req: express.Request): string {
  if (req.ip) return req.ip;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || '127.0.0.1';
}

// Memory-leak-free rate limiter with periodic cleanup and route-specific budgets per S9
const MAX_RATE_LIMIT_ENTRIES = 5000;
const rateLimitStores = {
  general: new Map<string, { count: number; resetTime: number }>(),
  auth: new Map<string, { count: number; resetTime: number }>()
};

function cleanupRateLimitStore(store: Map<string, { count: number; resetTime: number }>) {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(key);
    }
  }
}

// Periodically clean up expired IP rate limit records every 5 minutes
const cleanupInterval = setInterval(() => {
  cleanupRateLimitStore(rateLimitStores.general);
  cleanupRateLimitStore(rateLimitStores.auth);
}, 5 * 60 * 1000);
if (cleanupInterval.unref) {
  cleanupInterval.unref();
}

app.use(async (req, res, next) => {
  // Never rate-limit static assets, Vite internal modules, or root frontend navigation
  const isViteOrAsset =
    req.path.startsWith('/@') ||
    req.path.startsWith('/src/') ||
    req.path.startsWith('/node_modules/') ||
    /\.(js|ts|tsx|jsx|css|json|svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|map|html)$/i.test(req.path);

  if (isViteOrAsset) {
    return next();
  }

  const isAuthRoute = req.path.startsWith('/auth') || req.path.startsWith('/api/auth');
  const isApiRoute =
    req.path.startsWith('/api') ||
    req.path.startsWith('/fonts') ||
    req.path.startsWith('/generate-ai-prompt') ||
    req.path.startsWith('/health');

  if (!isAuthRoute && !isApiRoute) {
    return next();
  }

  const ip = getClientIp(req);
  const bucket = isAuthRoute ? 'auth' : 'general';
  const limit = isAuthRoute ? 20 : 60; // 20 req/min for auth routes, 60 req/min for general API

  try {
    // In production with a REST store configured the counter is shared across all
    // serverless instances. Locally we retain the in-memory per-process limiter.
    const shared = await checkSharedRateLimit(bucket, ip, limit);
    if (!shared.allowed) {
      res.setHeader('Retry-After', String(shared.retryAfter));
      return res.status(429).json({
        error: `Rate limit exceeded: maximum ${limit} requests per minute on this endpoint.`
      });
    }
    if (projectStore.kind === 'local-file') {
      const store = isAuthRoute ? rateLimitStores.auth : rateLimitStores.general;
      const now = Date.now();
      if (store.size > MAX_RATE_LIMIT_ENTRIES) cleanupRateLimitStore(store);
      const entry = store.get(ip);
      if (!entry || now > entry.resetTime) {
        store.set(ip, { count: 1, resetTime: now + 60000 });
        return next();
      }
      if (entry.count >= limit) {
        res.setHeader('Retry-After', '60');
        return res.status(429).json({
          error: `Rate limit exceeded: maximum ${limit} requests per minute on this endpoint.`
        });
      }
      entry.count++;
    }
    next();
  } catch (err) {
    console.error('Rate limiter error (failing open):', err);
    next();
  }
});

// Helper to register API endpoints
const router = express.Router();

// Health check endpoint with /health and /healthz per S11 & Doc 05 §5
router.get(['/health', '/healthz'], (_req, res) => {
  res.json({
    status: 'healthy',
    version: '1.6.0',
    storage: projectStore.kind
  });
});

let cachedFonts: any[] | null = null;

// Fonts API endpoint (Google Fonts developer proxy with snapshot fallback)
router.get('/fonts', async (_req, res) => {
  try {
    const key = process.env.GOOGLE_FONTS_API_KEY;
    if (key && !cachedFonts) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const r = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${key}&sort=popularity`,
        { signal: controller.signal }
      );
      clearTimeout(timeoutId);
      if (r.ok) {
        const data = (await r.json()) as any;
        cachedFonts = data.items.slice(0, 400).map((f: any, i: number) => ({
          family: f.family,
          category: f.category,
          variants: f.variants || ['400', '700'],
          subsets: f.subsets || ['latin'],
          popularityRank: i + 1,
          variable: !!f.axes,
          axes: f.axes,
          source: 'google'
        }));
      }
    }

    if (cachedFonts && cachedFonts.length > 0) {
      res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=604800');
      return res.json(cachedFonts);
    }
  } catch (e) {
    // fallback to local snapshot
  }

  try {
    const snapshotPath = path.resolve(process.cwd(), 'src', 'data', 'fonts.snapshot.json');
    if (fs.existsSync(snapshotPath)) {
      const raw = fs.readFileSync(snapshotPath, 'utf8');
      const parsed = JSON.parse(raw);
      res.setHeader('Cache-Control', 's-maxage=3600');
      return res.json(parsed);
    }
  } catch (err) {
    console.error('Error reading fonts snapshot:', err);
  }

  res.json([]);
});

// OAuth Client Configuration (Clean, no hardcoded fallbacks per S11)
router.get('/auth/config', (req, res) => {
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
  const redirectUri = getRedirectUri(req);
  const targetOrigin = getTargetOrigin(req);

  res.json({
    isConfigured: !!clientId,
    clientId,
    redirectUri,
    authorizedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      targetOrigin
    ],
    authorizedRedirectUris: [
      `${redirectUri}`
    ]
  });
});

// OAuth 2.0 URL Generator with CSRF state & PKCE per S5
router.get('/auth/url', (req, res) => {
  const provider = (req.query.provider as string) || 'google';
  const redirectUri = getRedirectUri(req);
  const targetOrigin = getTargetOrigin(req);
  const clientId = process.env.OAUTH_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;

  if (provider === 'github') {
    const ghClientId = process.env.GITHUB_CLIENT_ID;
    if (!ghClientId) {
      return res.status(501).json({
        isConfigured: false,
        error: 'GitHub OAuth is not configured. Set GITHUB_CLIENT_ID in environment.'
      });
    }

    const { state, cookieValue } = createOAuthState('github', targetOrigin);
    setOAuthStateCookie(res, cookieValue);

    const params = new URLSearchParams({
      client_id: ghClientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      response_type: 'code',
      state
    });

    return res.json({
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
      provider: 'github',
      isConfigured: true,
      redirectUri
    });
  }

  // Google OAuth 2.0
  if (!clientId) {
    return res.status(500).json({
      isConfigured: false,
      error: 'Google OAuth Client ID is not configured. Please set OAUTH_CLIENT_ID in .env.'
    });
  }

  const { state, codeChallenge, cookieValue } = createOAuthState('google', targetOrigin);
  setOAuthStateCookie(res, cookieValue);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email',
    prompt: 'select_account',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });

  return res.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    provider: 'google',
    isConfigured: true,
    redirectUri
  });
});

// ============================================================================
// DYNAMIC PER-USER PROJECT STORAGE (serverless-safe via api/projectStore.ts)
// ============================================================================

function getAuthenticatedUser(req: express.Request): SessionUser | null {
  const cookies = parseCookies(req.headers.cookie);
  const sessionToken =
    cookies[SESSION_COOKIE_NAME] ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);
  if (!sessionToken) return null;
  return verifySessionToken(sessionToken);
}

// Per-User Current Session Endpoint (Stateless, signed cookie verified per S2)
router.get('/auth/me', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.json({ authenticated: false, user: null, projectsCount: 0 });
  }

  const projects = await projectStore.read(user.id);
  res.json({
    authenticated: true,
    user,
    projectsCount: projects.length
  });
});

// Server-side Google ID Token Verification per S4
router.post('/auth/google-session', async (req, res) => {
  const { credential, idToken } = req.body;
  const token = credential || idToken;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Valid Google ID token (credential) required' });
  }

  try {
    const verifyRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`
    );
    if (!verifyRes.ok) {
      const errData = (await verifyRes.json().catch(() => ({}))) as any;
      return res.status(401).json({
        error: errData.error_description || 'Invalid or expired Google ID token'
      });
    }

    const payload = (await verifyRes.json()) as any;
    const configuredClientId = process.env.OAUTH_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    if (configuredClientId && payload.aud !== configuredClientId) {
      return res.status(401).json({
        error: 'Token audience does not match configured Google Client ID'
      });
    }

    const safeUser: SessionUser = {
      id: payload.sub || `google_${Date.now()}`,
      name: payload.name || payload.given_name || 'Google User',
      email: payload.email,
      avatar: payload.picture || generateInitialsAvatar(payload.name || payload.email),
      provider: 'google',
      authenticatedAt: Date.now()
    };

    const sessionToken = createSessionToken(safeUser);
    setSessionCookie(res, sessionToken);

    const userProjects = await projectStore.read(safeUser.id);
    res.json({ success: true, user: safeUser, projects: userProjects, projectsCount: userProjects.length });
  } catch (err: any) {
    console.error('Error verifying Google ID token:', err);
    res.status(500).json({ error: 'Failed to verify Google ID token with upstream identity provider' });
  }
});

// Direct email login is a local/demo convenience only. Production requires verified
// OAuth identity — without email ownership verification this endpoint would allow
// anyone to assume another user's identity by simply supplying their email address.
router.post('/auth/custom-login', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Direct email sign-in is disabled in production. Please sign in with Google.'
    });
  }

  const { name, email, avatar } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanName = (name || cleanEmail.split('@')[0]).trim();
  
  // Create deterministic stable user ID from email so logging in with same email restores all previous work!
  const emailHash = crypto.createHash('sha256').update(cleanEmail).digest('hex').slice(0, 16);
  const userId = `usr_${emailHash}`;

  const safeUser: SessionUser = {
    id: userId,
    name: cleanName,
    email: cleanEmail,
    avatar: avatar || generateInitialsAvatar(cleanName),
    provider: 'custom',
    authenticatedAt: Date.now()
  };

  const sessionToken = createSessionToken(safeUser);
  setSessionCookie(res, sessionToken);

  const existingProjects = await projectStore.read(userId);

  res.json({
    success: true,
    user: safeUser,
    projectsCount: existingProjects.length,
    projects: existingProjects
  });
});

// Logout Endpoint clearing session cookie per S2
router.post('/auth/logout', (_req, res) => {
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

// ============================================================================
// USER PROJECTS BACKEND PERSISTENCE ROUTES (Dynamic JSON per User)
// ============================================================================

// 1. GET /user/projects — Read all stored projects for authenticated user
router.get('/user/projects', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to view saved design systems.' });
  }

  const projects = await projectStore.read(user.id);
  res.json({
    success: true,
    userId: user.id,
    count: projects.length,
    projects
  });
});

// 2. POST /user/projects — Save or update a project in the user's store
router.post('/user/projects', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to create or save design systems.' });
  }

  const project = req.body.project || req.body;
  if (!project || !project.id || !project.name) {
    return res.status(400).json({ error: 'Valid project object with id and name is required.' });
  }

  const projects = await projectStore.read(user.id);
  const existingIdx = projects.findIndex((p: any) => p.id === project.id);
  const updatedProject = {
    ...project,
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    projects[existingIdx] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  await projectStore.write(user.id, projects);
  res.json({ success: true, project: updatedProject, count: projects.length });
});

// 3. PUT /user/projects/:id — Update existing project in the user's store
router.put('/user/projects/:id', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to update design systems.' });
  }

  const { id } = req.params;
  const project = req.body.project || req.body;
  const projects = await projectStore.read(user.id);
  const existingIdx = projects.findIndex((p: any) => p.id === id);

  const updatedProject = {
    ...(existingIdx >= 0 ? projects[existingIdx] : {}),
    ...project,
    id,
    updatedAt: Date.now()
  };

  if (existingIdx >= 0) {
    projects[existingIdx] = updatedProject;
  } else {
    projects.unshift(updatedProject);
  }

  await projectStore.write(user.id, projects);
  res.json({ success: true, project: updatedProject });
});

// 4. DELETE /user/projects/:id — Delete project from the user's store
router.delete('/user/projects/:id', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to delete design systems.' });
  }

  const { id } = req.params;
  const projects = await projectStore.read(user.id);
  const filtered = projects.filter((p: any) => p.id !== id);
  await projectStore.write(user.id, filtered);

  res.json({ success: true, message: 'Project deleted from cloud storage', remainingCount: filtered.length });
});

// 5. POST /user/projects/sync — Bulk sync / merge client projects into the user's store
router.post('/user/projects/sync', async (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Please log in to sync design systems.' });
  }

  const clientProjects = Array.isArray(req.body.projects) ? req.body.projects : [];
  const serverProjects = await projectStore.read(user.id);

  const map = new Map<string, any>();
  serverProjects.forEach((p: any) => map.set(p.id, p));
  clientProjects.forEach((p: any) => {
    if (!p || !p.id) return;
    const existing = map.get(p.id);
    if (!existing || (p.updatedAt || 0) >= (existing.updatedAt || 0)) {
      map.set(p.id, p);
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  await projectStore.write(user.id, merged);

  res.json({
    success: true,
    projects: merged,
    count: merged.length
  });
});

// AI prompt helper endpoint with real Gemini AI generation per S11
router.post('/generate-ai-prompt', async (req, res) => {
  const { project } = req.body;
  if (!project || !project.name || typeof project.name !== 'string') {
    return res.status(400).json({ error: 'Project data required' });
  }

  // All untrusted fields are escaped before being interpolated into any returned text.
  const safeName = escapeHtml(project.name.slice(0, 120));
  const safeCategory = escapeHtml(String(project.tokens?.meta?.category || 'general').slice(0, 60));
  const safeAudience = escapeHtml(String(project.business?.audience || 'modern users').slice(0, 120));

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create an inspiring 2-sentence design direction brief for a website called "${safeName}" in category "${safeCategory}" targeting "${safeAudience}".`
      });
      const generated = response.text?.trim();
      if (generated) {
        return res.json({ success: true, timestamp: Date.now(), prompt: escapeHtml(generated) });
      }
    } catch (aiErr) {
      console.warn('Gemini prompt generation notice:', aiErr);
    }
  }

  res.json({
    success: true,
    timestamp: Date.now(),
    prompt: `A bespoke, modern digital experience for ${safeName}, designed with accessible OKLCH color palettes, fluid typography, and ergonomic spatial rhythm tailored for ${safeAudience}.`
  });
});

// OAuth 2.0 Callback Handler with CSRF check, HTML escaping, and safe origin postMessage per S5, S6, S7
const handleOAuthCallback = async (req: express.Request, res: express.Response) => {
  const { code, error, error_description, state, provider = 'google' } = req.query;

  // 1. Verify CSRF state parameter from HttpOnly cookie
  const cookies = parseCookies(req.headers.cookie);
  const cookieState = cookies[OAUTH_STATE_COOKIE_NAME];
  const statePayload = verifyOAuthState(cookieState, state as string);

  // Clear state cookie regardless
  clearOAuthStateCookie(res);

  const fallbackOrigin = getTargetOrigin(req);
  const targetOrigin = statePayload?.targetOrigin || fallbackOrigin;

  if (error) {
    const safeError = escapeHtml(
      (error_description as string) || (error as string) || 'Authentication Error'
    );
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Authentication Error</h2>
          <p>${safeError}</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  }

  if (!statePayload) {
    return res.status(403).send(`
      <!DOCTYPE html>
      <html>
        <head><title>CSRF Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Security Verification Failed</h2>
          <p>Invalid or expired OAuth state parameter (CSRF protection triggered). Please try signing in again.</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  }

  if (!code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>No authorization code received</h2>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  }

  let userProfile: SessionUser;

  try {
    const isGitHub = provider === 'github';
    const tokenEndpoint = isGitHub
      ? 'https://github.com/login/oauth/access_token'
      : 'https://oauth2.googleapis.com/token';

    const clientId = isGitHub
      ? process.env.GITHUB_CLIENT_ID
      : process.env.OAUTH_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID;
    const clientSecret = isGitHub
      ? process.env.GITHUB_CLIENT_SECRET
      : process.env.OAUTH_CLIENT_SECRET;

    if (!clientId) {
      throw new Error('OAuth Client ID is not configured on this server.');
    }

    const tokenParams: Record<string, string> = {
      client_id: clientId,
      client_secret: clientSecret || '',
      code: code as string,
      redirect_uri: getRedirectUri(req),
      grant_type: 'authorization_code'
    };

    if (!isGitHub && statePayload.codeVerifier) {
      tokenParams.code_verifier = statePayload.codeVerifier;
    }

    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      body: new URLSearchParams(tokenParams).toString()
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const accessToken = tokenData.access_token;
    if (!accessToken) {
      throw new Error('No access token received from identity provider');
    }

    let name = 'User';
    let email = '';
    let avatar = '';
    let userId = `usr_${Date.now()}`;

    if (isGitHub) {
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'DesignSystemStudio' }
      });
      const userData = await userRes.json();
      name = userData.name || userData.login;
      email = userData.email || '';
      avatar = userData.avatar_url || generateInitialsAvatar(name);
      userId = String(userData.id);
    } else {
      const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userData = await userRes.json();
      name = userData.name || userData.given_name || 'Google User';
      email = userData.email || '';
      avatar = userData.picture || generateInitialsAvatar(name || email);
      userId = userData.sub || userId;
    }

    // Never persist or return accessToken to browser per S8
    userProfile = {
      id: userId,
      name,
      email,
      avatar,
      provider: isGitHub ? 'github' : 'google',
      authenticatedAt: Date.now()
    };
  } catch (err: any) {
    console.error('OAuth token exchange error:', err);
    const safeMsg = escapeHtml(err.message || 'Error communicating with token endpoint');
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Token Exchange Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Authentication Could Not Complete</h2>
          <p>${safeMsg}</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  }

  // Issue per-user signed session cookie per S2
  const sessionToken = createSessionToken(userProfile);
  setSessionCookie(res, sessionToken);

  const safeJson = JSON.stringify(userProfile).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  const safeName = escapeHtml(userProfile.name);
  const safeEmail = escapeHtml(userProfile.email);

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Authentication Successful</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f9fafb;
            color: #111827;
          }
          .card {
            background: white;
            padding: 2.5rem;
            border-radius: 1rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
            text-align: center;
            max-width: 420px;
            width: 90%;
          }
          .icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            background: #ecfdf5;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #059669;
            font-size: 24px;
          }
          h1 { font-size: 1.25rem; font-weight: 700; margin: 0 0 0.5rem; }
          p { color: #6b7280; font-size: 0.875rem; margin: 0 0 1.5rem; line-height: 1.5; }
          .badge {
            display: inline-block;
            background: #eff6ff;
            color: #1d4ed8;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            margin-bottom: 1rem;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="icon">✓</div>
          <div class="badge">Identity Verified · Per-User Session</div>
          <h1>Authentication Successful!</h1>
          <p>Welcome, <strong>${safeName}</strong> (${safeEmail}). Returning to Studio...</p>
        </div>
        <script>
          (function() {
            try {
              var user = ${safeJson};
              var targetOrigin = ${JSON.stringify(targetOrigin)};

              try {
                if (typeof BroadcastChannel !== 'undefined') {
                  var channel = new BroadcastChannel('google_auth_realtime_channel');
                  channel.postMessage({ type: 'LOGIN', user: user });
                  channel.close();
                }
              } catch (e) {}

              if (window.opener) {
                try {
                  window.opener.postMessage({
                    type: 'OAUTH_AUTH_SUCCESS',
                    user: user
                  }, targetOrigin);
                } catch (e) {}
                setTimeout(function() { window.close(); }, 600);
              } else {
                setTimeout(function() { window.location.href = '/'; }, 600);
              }
            } catch (e) {
              window.location.href = '/';
            }
          })();
        </script>
      </body>
    </html>
  `);
};

// Mount routes to support both /api/... and direct routing on Vercel
app.use('/api', router);
app.use('/', router);
app.get('/auth/callback', handleOAuthCallback);
app.get('/auth/callback/', handleOAuthCallback);

export default app;
