import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  AlertCircle,
  LogOut,
  RefreshCw,
  Mail,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFocusTrap } from '../../utils/useFocusTrap';

const DEMO_PERSONAS = [
  { name: 'Alex Rivers', email: 'alex.rivers@designstudio.local', role: 'Design Lead' },
  { name: 'Elena Vance', email: 'elena.vance@atelier.design', role: 'Creative Dir' },
  { name: 'Jordan Hayes', email: 'jordan.hayes@saas.tech', role: 'Founder' }
];

export const OAuthModal: React.FC = () => {
  const {
    isOAuthModalOpen,
    setIsOAuthModalOpen,
    user,
    isLoading,
    authError,
    clearAuthError,
    loginWithGoogle,
    loginWithGoogleCredential,
    loginWithCustomAccount,
    logout,
    googleClientId
  } = useAuth();

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const isGsiInitialized = React.useRef(false);

  const handleClose = () => {
    clearAuthError();
    setIsOAuthModalOpen(false);
  };

  const modalRef = useFocusTrap<HTMLDivElement>(isOAuthModalOpen, handleClose);

  // Auto-initialize Google Identity Services (One Tap & ID Token) in background
  useEffect(() => {
    if (isOAuthModalOpen && !isGsiInitialized.current) {
      const google = (window as any).google;
      if (google?.accounts?.id && googleClientId) {
        try {
          google.accounts.id.initialize({
            client_id: googleClientId,
            auto_select: false,
            callback: (response: any) => {
              if (response.credential) {
                loginWithGoogleCredential(response.credential).catch((err: any) => {
                  console.error('Google ID token sign-in error:', err);
                });
              }
            }
          });
          isGsiInitialized.current = true;

          // Prompt native Google One Tap
          try {
            google.accounts.id.prompt();
          } catch (e) {
            // One Tap prompt optional
          }
        } catch (e) {
          console.warn('GIS initialize notice:', e);
        }
      }
    }
  }, [isOAuthModalOpen, googleClientId, loginWithGoogleCredential]);

  if (!isOAuthModalOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim()) return;
    loginWithCustomAccount(userName.trim() || userEmail.split('@')[0], userEmail.trim());
  };

  const handlePersonaSelect = (persona: typeof DEMO_PERSONAS[0]) => {
    loginWithCustomAccount(persona.name, persona.email);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-2xl shadow-2xl border border-neutral-200/80 max-w-[410px] w-full p-6 sm:p-7 relative overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close authentication modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="text-center pt-1">
          <div className="inline-flex items-center justify-center mb-3">
            <img
              src="/icon.png"
              alt="Design System Studio"
              className="w-14 h-14 rounded-2xl object-contain drop-shadow-md hover:scale-105 transition-transform"
            />
          </div>

          <h2 id="auth-modal-title" className="text-xl font-bold tracking-tight text-neutral-900">
            {user ? 'Account Signed In' : 'Sign In to Design Studio'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1 max-w-[310px] mx-auto leading-relaxed">
            {user
              ? 'Your design systems sync dynamically to your account and persistent JSON store.'
              : 'Sign in to create, edit, and automatically store all your design systems dynamically.'}
          </p>
        </div>

        {/* Error Notice */}
        {authError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold">Sign In Notice</p>
              <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">{authError}</p>
            </div>
            <button
              onClick={clearAuthError}
              className="text-rose-400 hover:text-rose-700 text-xs shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="mt-5 space-y-4">
          {user ? (
            /* Signed-In State */
            <div className="space-y-3">
              <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-3.5 flex items-center gap-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-neutral-200 object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user.name}</p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => setIsOAuthModalOpen(false)}
                  className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Continue to Studio
                </button>
                <button
                  onClick={logout}
                  disabled={isLoading}
                  className="py-2.5 px-3 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-neutral-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            /* Sign-In Actions */
            <div className="space-y-3.5">
              {/* Primary Action: Continue with Google (Bookmark Split Design) */}
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                disabled={isLoading}
                className="w-full flex items-stretch rounded-xl bg-white hover:bg-neutral-50 active:bg-neutral-100 text-neutral-800 text-xs sm:text-sm font-semibold border border-neutral-300 shadow-2xs hover:border-neutral-400 hover:shadow-xs transition-all disabled:opacity-50 cursor-pointer overflow-hidden group font-sans"
              >
                {isLoading ? (
                  <div className="w-full flex items-center justify-center gap-2 py-3 px-4">
                    <RefreshCw className="w-4 h-4 animate-spin text-neutral-600" />
                    <span className="text-xs font-medium text-neutral-600">Connecting...</span>
                  </div>
                ) : (
                  <>
                    {/* Left Chamber: Google SVG */}
                    <div className="flex items-center justify-center px-3.5 py-2.5 bg-neutral-50 group-hover:bg-neutral-100 border-r border-neutral-200 transition-colors">
                      <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    {/* Right Chamber: Label */}
                    <div className="flex-1 flex items-center justify-center py-2.5 px-4">
                      <span>Continue with Google</span>
                    </div>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                  or direct login
                </span>
                <div className="flex-1 h-px bg-neutral-200" />
              </div>

              {/* Direct Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    placeholder="Full name (optional)"
                    className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-neutral-900 bg-white"
                  />
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                    <input
                      type="email"
                      required
                      value={userEmail}
                      onChange={e => setUserEmail(e.target.value)}
                      placeholder="your.email@domain.com"
                      className="w-full pl-7 pr-2.5 py-2 text-xs border border-neutral-300 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-neutral-900 bg-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userEmail.trim()}
                  className="w-full py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  <span>Sign In with Email & Sync</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>

              {/* Fast 1-Click Test Accounts */}
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
                  1-Click Quick Demo Sign In
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {DEMO_PERSONAS.map(p => (
                    <button
                      key={p.email}
                      type="button"
                      onClick={() => handlePersonaSelect(p)}
                      disabled={isLoading}
                      className="text-left px-2 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-400 bg-neutral-50/70 hover:bg-neutral-100 transition-colors cursor-pointer group"
                      title={`Sign in as ${p.name} (${p.email})`}
                    >
                      <p className="text-[11px] font-semibold text-neutral-800 group-hover:text-black truncate">
                        {p.name.split(' ')[0]}
                      </p>
                      <p className="text-[9px] text-neutral-400 truncate">{p.role}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security & Terms Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <span>Real-time authentication via Google Identity</span>
        </div>
      </motion.div>
    </div>
  );
};
