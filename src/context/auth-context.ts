import { createContext, useContext } from 'react';

/**
 * Context definition and consumer hook live in their own module.
 *
 * Keeping them separate from `AuthContext.tsx` means that file exports only
 * the `AuthProvider` component, which is what React Fast Refresh requires.
 * When a module mixes component and non-component exports, Vite has to
 * invalidate the whole module on every edit, which tears down the provider
 * and throws "useAuth must be used within an AuthProvider" in the browser.
 */

export interface OAuthUser {
  id: string; // Google sub / Unique ID
  uid: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'oauth2' | 'custom';
  accessToken?: string;
  idToken?: string;
  scope: string;
  emailVerified?: boolean;
  authenticatedAt: number;
}

export interface AuthContextType {
  user: OAuthUser | null;
  isLoading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  loginWithGoogle: () => Promise<OAuthUser | null>;
  loginWithGoogleCredential: (credential: string) => Promise<OAuthUser>;
  loginWithOAuth: (provider?: 'google' | 'github') => Promise<void>;
  loginWithCustomAccount: (name: string, email: string, avatar?: string) => Promise<void>;
  logout: () => Promise<void>;
  isOAuthModalOpen: boolean;
  setIsOAuthModalOpen: (open: boolean) => void;
  googleClientId: string;
  setGoogleClientId: (id: string) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
