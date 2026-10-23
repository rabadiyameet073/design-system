import 'dotenv/config';
import express from 'express';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'oauth2' | 'custom';
  accessToken?: string;
  scope: string;
  authenticatedAt: number;
}

// In-memory OAuth 2.0 sessions store
let currentActiveSession: UserSession | null = null;

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

export const app = express();

app.use(express.json({ limit: '10mb' }));

// Helper to register API endpoints
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.2.0',
    service: 'Design System Studio Full-Stack Engine (Real-Time Google OAuth 2.0 - Zero Firebase)',
    authType: 'Google Identity Services / OAuth 2.0 (RFC 6749)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Real-Time OAuth Client Configuration
router.get('/auth/config', (req, res) => {
  const clientId =
    process.env.OAUTH_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    '392976489628-iik084o59qhv5ootq0f3isa13l7kp2o3.apps.googleusercontent.com';
  const redirectUri = getRedirectUri(req);
  res.json({
    clientId,
    redirectUri,
    authorizedOrigins: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : [])
    ],
    authorizedRedirectUris: [
      `${redirectUri}`,
      'http://localhost:3000/auth/callback',
      'http://localhost:3000'
    ]
  });
});

// OAUTH 2.0: URL Generator Endpoint for Google & GitHub
router.get('/auth/url', (req, res) => {
  const provider = (req.query.provider as string) || 'google';
  const redirectUri = getRedirectUri(req);
  const clientId =
    process.env.OAUTH_CLIENT_ID ||
    process.env.VITE_GOOGLE_CLIENT_ID ||
    '392976489628-iik084o59qhv5ootq0f3isa13l7kp2o3.apps.googleusercontent.com';

  if (provider === 'github') {
    const ghClientId = process.env.GITHUB_CLIENT_ID || clientId;
    const params = new URLSearchParams({
      client_id: ghClientId,
      redirect_uri: redirectUri,
      scope: 'read:user user:email',
      response_type: 'code',
      state: `oauth_state_${Date.now()}`
    });
    return res.json({
      url: `https://github.com/login/oauth/authorize?${params.toString()}`,
      provider: 'github',
      isConfigured: true,
      redirectUri
    });
  }

  // Real Google OAuth 2.0 (Strictly identity: profile & email only, NEVER Drive)
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid profile email', // Pure identity authentication - NO Drive permissions
    prompt: 'select_account',
    state: `oauth_state_${Date.now()}`
  });
  return res.json({
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    provider: 'google',
    isConfigured: true,
    redirectUri
  });
});

// OAUTH 2.0: Current Session Endpoint
router.get('/auth/me', (req, res) => {
  res.json({
    authenticated: !!currentActiveSession,
    user: currentActiveSession
  });
});

// Client-side Google Identity Services Session sync
router.post('/auth/google-session', (req, res) => {
  const { user } = req.body;
  if (!user || !user.email) {
    return res.status(400).json({ error: 'Valid user profile required' });
  }
  currentActiveSession = {
    id: user.id || `google_${Date.now()}`,
    name: user.name || 'Google User',
    email: user.email,
    avatar:
      user.avatar ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80',
    provider: 'google',
    accessToken: user.accessToken,
    scope: user.scope || 'openid profile email',
    authenticatedAt: Date.now()
  };
  res.json({ success: true, user: currentActiveSession });
});

// Direct login for custom user email/name (No fake founder)
router.post('/auth/custom-login', (req, res) => {
  const { name, email, avatar } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  currentActiveSession = {
    id: `user_${Date.now()}`,
    name: name || email.split('@')[0],
    email: email,
    avatar:
      avatar ||
      `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
    provider: 'custom',
    scope: 'openid profile email',
    authenticatedAt: Date.now()
  };
  res.json({
    success: true,
    user: currentActiveSession
  });
});

// OAUTH 2.0: Logout Endpoint
router.post('/auth/logout', (req, res) => {
  currentActiveSession = null;
  res.json({ success: true, message: 'Logged out successfully' });
});

// AI prompt helper endpoint
router.post('/generate-ai-prompt', (req, res) => {
  const { project } = req.body;
  if (!project || !project.name) {
    return res.status(400).json({ error: 'Project data required' });
  }

  res.json({
    success: true,
    timestamp: Date.now(),
    prompt: `Website Design System prompt for ${project.name}`
  });
});

// OAUTH 2.0: Callback Handler
const handleOAuthCallback = async (req: express.Request, res: express.Response) => {
  const { code, error, error_description, provider } = req.query;

  if (error) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Google Authentication Error</h2>
          <p>${error_description || error}</p>
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

  let userProfile: UserSession;

  try {
    const tokenEndpoint =
      provider === 'github'
        ? 'https://github.com/login/oauth/access_token'
        : 'https://oauth2.googleapis.com/token';

    const clientId =
      process.env.OAUTH_CLIENT_ID ||
      process.env.VITE_GOOGLE_CLIENT_ID ||
      '392976489628-iik084o59qhv5ootq0f3isa13l7kp2o3.apps.googleusercontent.com';
    const clientSecret = process.env.OAUTH_CLIENT_SECRET || '';

    const tokenParams: Record<string, string> = {
      client_id: clientId,
      client_secret: clientSecret,
      code: code as string,
      redirect_uri: getRedirectUri(req),
      grant_type: 'authorization_code'
    };

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

    let name = 'Google User';
    let email = 'user@gmail.com';
    let avatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80';
    let userId = `google_${Date.now()}`;

    if (accessToken) {
      if (provider === 'github') {
        const userRes = await fetch('https://api.github.com/user', {
          headers: { Authorization: `Bearer ${accessToken}`, 'User-Agent': 'DesignSystemStudio' }
        });
        const userData = await userRes.json();
        name = userData.name || userData.login;
        email = userData.email || `${userData.login}@github.com`;
        avatar = userData.avatar_url || avatar;
        userId = String(userData.id);
      } else {
        const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userData = await userRes.json();
        name = userData.name || name;
        email = userData.email || email;
        avatar = userData.picture || avatar;
        userId = userData.sub || userId;
      }
    }

    userProfile = {
      id: userId,
      name,
      email,
      avatar,
      provider: (provider as 'google' | 'github') || 'google',
      accessToken,
      scope: 'openid profile email',
      authenticatedAt: Date.now()
    };
  } catch (err: any) {
    console.error('OAuth token exchange error:', err);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>OAuth Token Exchange Error</title><style>body{font-family:sans-serif;padding:2rem;text-align:center;}</style></head>
        <body>
          <h2>Google Sign-In Could Not Complete</h2>
          <p>${err.message || 'Error communicating with Google token endpoint'}</p>
          <button onclick="window.close()">Close Window</button>
        </body>
      </html>
    `);
  }

  currentActiveSession = userProfile;

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>Google Authentication Successful</title>
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
          <div class="badge">Google Identity Verified · Real-Time</div>
          <h1>Authentication Successful!</h1>
          <p>Welcome, <strong>${userProfile.name}</strong> (${userProfile.email}). Returning to Studio...</p>
        </div>
        <script>
          try {
            const user = ${JSON.stringify(userProfile)};
            try {
              localStorage.setItem('dss_google_user_session_v2', JSON.stringify(user));
            } catch (e) {}

            try {
              if (typeof BroadcastChannel !== 'undefined') {
                const channel = new BroadcastChannel('google_auth_realtime_channel');
                channel.postMessage({ type: 'LOGIN', user });
                channel.close();
              }
            } catch (e) {}

            if (window.opener) {
              try {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  user: user
                }, '*');
              } catch (e) {}
              setTimeout(() => window.close(), 600);
            } else {
              setTimeout(() => { window.location.href = '/'; }, 600);
            }
          } catch (e) {
            window.location.href = '/';
          }
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
