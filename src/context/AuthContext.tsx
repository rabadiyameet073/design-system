import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext, AuthContextType, OAuthUser } from './auth-context';

export type { OAuthUser, AuthContextType };

const STORAGE_KEY_AUTH = 'dss_google_user_session_v2';
const STORAGE_KEY_CLIENT_ID = 'dss_google_client_id_custom';
const AUTH_CHANNEL_NAME = 'google_auth_realtime_channel';

// Default Google OAuth Client ID configured in environment
const DEFAULT_GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  '392976489628-iik084o59qhv5ootq0f3isa13l7kp2o3.apps.googleusercontent.com';

function broadcastAuthChange(type: 'LOGIN' | 'LOGOUT', user?: OAuthUser) {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
      channel.postMessage({ type, user });
      channel.close();
    }
  } catch (e) {
    // BroadcastChannel unsupported or blocked
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<OAuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Exclude legacy mock founder accounts
        if (parsed.name === 'Founder Member' || parsed.email === 'founder@designstudio.local') {
          localStorage.removeItem(STORAGE_KEY_AUTH);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [googleClientId, setGoogleClientIdState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_CLIENT_ID) || DEFAULT_GOOGLE_CLIENT_ID;
    } catch {
      return DEFAULT_GOOGLE_CLIENT_ID;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState(false);

  const setGoogleClientId = useCallback((newId: string) => {
    setGoogleClientIdState(newId);
    try {
      localStorage.setItem(STORAGE_KEY_CLIENT_ID, newId);
    } catch (e) {
      console.warn('Could not save custom client ID:', e);
    }
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  // Fetch real-time OAuth client ID configuration from server / .env
  useEffect(() => {
    fetch('/api/auth/config')
      .then(r => r.json())
      .then(data => {
        if (data.clientId) {
          setGoogleClientIdState(data.clientId);
        }
      })
      .catch(() => {});
  }, []);

  // 1. Sync session on initial load with server
  useEffect(() => {
    const checkServerSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            // Discard any simulated legacy founder profiles
            if (data.user.name === 'Founder Member' || data.user.email === 'founder@designstudio.local') {
              await fetch('/api/auth/logout', { method: 'POST' });
              return;
            }
            setUser(data.user);
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(data.user));
          }
        }
      } catch (e) {
        // server session check non-critical
      }
    };
    checkServerSession();
  }, []);

  // 2. Real-time multi-tab synchronization via BroadcastChannel & Storage events
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        channel = new BroadcastChannel(AUTH_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type === 'LOGIN' && event.data.user) {
            setUser(event.data.user);
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(event.data.user));
          } else if (event.data?.type === 'LOGOUT') {
            setUser(null);
            localStorage.removeItem(STORAGE_KEY_AUTH);
          }
        };
      }
    } catch (e) {
      console.warn('Real-time auth broadcast channel notice:', e);
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY_AUTH) {
        if (event.newValue) {
          try {
            setUser(JSON.parse(event.newValue));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Sync when returning to tab from popup or external auth window
    const handleFocus = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_AUTH);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed?.id && (!user || user.id !== parsed.id)) {
            setUser(parsed);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  // 3. Listen for OAuth popup postMessage callback events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin &&
        !event.origin.includes('localhost') &&
        !event.origin.endsWith('.run.app')
      ) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data.user) {
        const authedUser: OAuthUser = {
          id: event.data.user.id || `google_${Date.now()}`,
          uid: event.data.user.id || `google_${Date.now()}`,
          name: event.data.user.name,
          email: event.data.user.email,
          avatar: event.data.user.avatar,
          provider: event.data.user.provider || 'google',
          accessToken: event.data.user.accessToken,
          idToken: event.data.user.idToken,
          scope: event.data.user.scope || 'openid profile email',
          emailVerified: event.data.user.emailVerified ?? true,
          authenticatedAt: Date.now()
        };
        setUser(authedUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authedUser));
        broadcastAuthChange('LOGIN', authedUser);
        setIsOAuthModalOpen(false);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // 4. Real-time Google Credential Login from Google Identity Services 1-Click / One-Tap
  const loginWithGoogleCredential = useCallback(async (credential: string): Promise<OAuthUser> => {
    setIsLoading(true);
    setAuthError(null);
    try {
      // Decode JWT ID token payload safely
      const base64Url = credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);

      const realUser: OAuthUser = {
        id: payload.sub,
        uid: payload.sub,
        name: payload.name || payload.given_name || 'Google User',
        email: payload.email,
        avatar:
          payload.picture ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(payload.name || payload.email)}`,
        provider: 'google',
        idToken: credential,
        scope: 'openid email profile',
        emailVerified: payload.email_verified ?? true,
        authenticatedAt: Date.now()
      };

      setUser(realUser);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(realUser));
      broadcastAuthChange('LOGIN', realUser);

      // Sync active session with server
      fetch('/api/auth/google-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: realUser })
      }).catch(err => console.warn('Server session sync notice:', err));

      setIsOAuthModalOpen(false);
      return realUser;
    } catch (err: any) {
      console.error('Failed to parse Google ID token credential:', err);
      setAuthError('Could not verify Google ID credential token.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 5. Real-time Google Sign-In with Google Identity Services (GIS) / Token Client
  const loginWithGoogle = useCallback(async (): Promise<OAuthUser | null> => {
    setIsLoading(true);
    setAuthError(null);

    return new Promise(async (resolve, reject) => {
      // Helper to check window.google readiness
      let google = (window as any).google;
      if (!google?.accounts?.oauth2) {
        // Wait up to 1.5s for GIS script
        for (let i = 0; i < 15; i++) {
          await new Promise(r => setTimeout(r, 100));
          if ((window as any).google?.accounts?.oauth2) {
            google = (window as any).google;
            break;
          }
        }
      }

      if (google?.accounts?.oauth2) {
        try {
          const tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'openid email profile',
            callback: async (tokenResponse: any) => {
              if (tokenResponse.error) {
                // If user simply closed the popup or cancelled, do not display a red error banner
                if (
                  tokenResponse.error === 'popup_closed_by_user' ||
                  tokenResponse.error === 'access_denied'
                ) {
                  setIsLoading(false);
                  resolve(null);
                  return;
                }
                console.error('Google OAuth token client error:', tokenResponse);
                const msg = `Google sign-in error: ${tokenResponse.error_description || tokenResponse.error}`;
                setAuthError(msg);
                setIsLoading(false);
                reject(new Error(msg));
                return;
              }

              try {
                // Fetch verified profile directly from Google
                const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
                });

                if (!userRes.ok) {
                  throw new Error('Failed to fetch user profile from Google');
                }

                const profile = await userRes.json();

                const realUser: OAuthUser = {
                  id: profile.sub || `google_${Date.now()}`,
                  uid: profile.sub || `google_${Date.now()}`,
                  name: profile.name || profile.given_name || 'Google User',
                  email: profile.email,
                  avatar:
                    profile.picture ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(profile.name || profile.email)}`,
                  provider: 'google',
                  accessToken: tokenResponse.access_token,
                  scope: 'openid email profile',
                  emailVerified: profile.email_verified ?? true,
                  authenticatedAt: Date.now()
                };

                setUser(realUser);
                localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(realUser));
                broadcastAuthChange('LOGIN', realUser);

                // Notify backend server to store active session
                fetch('/api/auth/google-session', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user: realUser })
                }).catch(() => {});

                setIsOAuthModalOpen(false);
                setIsLoading(false);
                resolve(realUser);
              } catch (fetchErr: any) {
                console.error('Failed to parse Google userinfo:', fetchErr);
                setAuthError('Could not retrieve Google profile details.');
                setIsLoading(false);
                reject(fetchErr);
              }
            }
          });

          // Request access token with account selection popup
          tokenClient.requestAccessToken({ prompt: 'select_account' });
          return;
        } catch (err: any) {
          console.warn('GIS TokenClient initiation issue:', err);
        }
      }

      // Fallback: Open Google OAuth 2.0 authorization popup via server endpoint
      fetch(`/api/auth/url?provider=google`)
        .then(res => res.json())
        .then(data => {
          if (!data.url) throw new Error('Could not obtain Google OAuth URL');
          const width = 600;
          const height = 700;
          const left = window.screen.width / 2 - width / 2;
          const top = window.screen.height / 2 - height / 2;

          const authWindow = window.open(
            data.url,
            'google_oauth_popup',
            `width=${width},height=${height},left=${left},top=${top},status=yes,toolbar=no,menubar=no`
          );

          if (!authWindow) {
            setAuthError('Please allow popups to sign in with Google.');
            setIsLoading(false);
            reject(new Error('Popup blocked'));
          }
        })
        .catch(err => {
          console.error('Server Google OAuth popup error:', err);
          setAuthError(err.message || 'Failed to initiate Google authorization.');
          setIsLoading(false);
          reject(err);
        });
    });
  }, [googleClientId]);

  // 5. General OAuth entry point
  const loginWithOAuth = useCallback(
    async (provider: 'google' | 'github' = 'google') => {
      if (provider === 'google') {
        await loginWithGoogle();
        return;
      }

      setIsLoading(true);
      setAuthError(null);
      try {
        const res = await fetch(`/api/auth/url?provider=${provider}`);
        if (!res.ok) {
          throw new Error('Could not fetch OAuth authorization URL');
        }
        const data = await res.json();

        const width = 600;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const authWindow = window.open(
          data.url,
          'oauth_auth_popup',
          `width=${width},height=${height},left=${left},top=${top},status=yes,toolbar=no,menubar=no`
        );

        if (!authWindow) {
          setAuthError('Please allow popups to sign in with OAuth.');
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('OAuth initialization error:', err);
        setAuthError(err.message || 'OAuth sign-in failed');
      } finally {
        setIsLoading(false);
      }
    },
    [loginWithGoogle]
  );

  // 6. Sign in directly with custom real user credentials (ZERO fake founder)
  const loginWithCustomAccount = useCallback(
    async (name: string, email: string, avatar?: string) => {
      setIsLoading(true);
      setAuthError(null);
      try {
        const cleanEmail = email.trim();
        const cleanName = name.trim() || cleanEmail.split('@')[0];
        const userAvatar =
          avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(cleanName)}`;

        const customUser: OAuthUser = {
          id: `usr_${Date.now()}`,
          uid: `usr_${Date.now()}`,
          name: cleanName,
          email: cleanEmail,
          avatar: userAvatar,
          provider: cleanEmail.endsWith('@gmail.com') ? 'google' : 'custom',
          scope: 'openid profile email',
          emailVerified: true,
          authenticatedAt: Date.now()
        };

        setUser(customUser);
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(customUser));
        broadcastAuthChange('LOGIN', customUser);

        // Sync with server session
        fetch('/api/auth/custom-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: cleanName, email: cleanEmail, avatar: userAvatar })
        }).catch(() => {});

        setIsOAuthModalOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 7. Real-Time Sign Out across all tabs
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    }
    setUser(null);
    setAuthError(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    broadcastAuthChange('LOGOUT');
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        authError,
        clearAuthError,
        loginWithGoogle,
        loginWithGoogleCredential,
        loginWithOAuth,
        loginWithCustomAccount,
        logout,
        isOAuthModalOpen,
        setIsOAuthModalOpen,
        googleClientId,
        setGoogleClientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
