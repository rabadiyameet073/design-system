import React, { useState } from 'react';
import { DesignProject } from '../../types/designSystem';
import { useAuth } from '../../context/auth-context';

interface HeaderProps {
  currentView: 'landing' | 'wizard' | 'dashboard' | 'workspace';
  onNavigate: (view: 'landing' | 'wizard' | 'dashboard' | 'workspace') => void;
  activeProject?: DesignProject;
  onTogglePreviewDrawer?: () => void;
  isPreviewDrawerOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  activeProject,
  onTogglePreviewDrawer,
  isPreviewDrawerOpen
}) => {
  const { user, setIsOAuthModalOpen, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navLink = (active: boolean) =>
    `relative whitespace-nowrap shrink-0 transition-colors font-michroma tracking-wider uppercase text-xs sm:text-[13px] ${
      active ? 'text-ink font-bold' : 'text-ink/65 hover:text-ink'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rule font-zen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4 sm:gap-6">
        {/* Zone 1: brand logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="hover:opacity-90 transition-opacity text-left flex items-center shrink-0 cursor-pointer py-1"
          title="Design System Studio Home"
        >
          <img
            src="/logo.png"
            alt="Design System Studio"
            className="h-11 sm:h-13 md:h-14 w-auto object-contain max-h-14 shrink-0 mix-blend-multiply select-none"
          />
        </button>

        {/* Zone 2: text navigation links — Michroma font by Vernon Adams */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-michroma">
          <button
            onClick={() => onNavigate('landing')}
            className={navLink(currentView === 'landing')}
          >
            Overview
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className={navLink(currentView === 'dashboard')}
          >
            Projects
          </button>
          {activeProject && (
            <button
              onClick={() => onNavigate('wizard')}
              className={navLink(currentView === 'wizard')}
            >
              Design Wizard
            </button>
          )}
          {activeProject && (
            <button
              onClick={() => onNavigate('workspace')}
              className={navLink(currentView === 'workspace')}
            >
              Workspace
            </button>
          )}
        </nav>

        {/* Zone 3: account state + primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Real-Time Google Auth User State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="group flex items-stretch rounded-xl border border-ink/15 hover:border-ink/35 bg-white hover:bg-ink/[0.03] transition-all text-xs text-ink overflow-hidden shrink-0 cursor-pointer shadow-2xs"
                title="Account Settings"
              >
                {/* Left Chamber: User Avatar */}
                <div className="flex items-center justify-center px-2.5 py-1.5 bg-ink/[0.03] border-r border-ink/15">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover border border-ink/15"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  </div>
                </div>
                {/* Right Chamber: User Name & Dropdown Arrow */}
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <span className="font-semibold max-w-[100px] truncate hidden sm:inline">
                    {user.name}
                  </span>
                  <span className="text-[10px] bg-clay-wash text-clay font-bold px-1.5 py-0.5 rounded hidden md:inline">
                    Live
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-ink/40 group-hover:text-ink transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-lg border border-rule p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-rule mb-1">
                    <p className="font-bold text-ink truncate">{user.name}</p>
                    <p className="text-ink/50 text-[11px] truncate">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-clay font-mono bg-clay-wash px-2 py-0.5 rounded">
                      <span className="w-1.5 h-1.5 rounded-full bg-clay" />
                      <span>Google Auth Real-Time</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left font-medium cursor-pointer"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Split-Chamber Google Sign In Button */
            <button
              onClick={() => setIsOAuthModalOpen(true)}
              className="group flex items-stretch rounded-xl bg-white hover:bg-stone-50 text-ink border border-ink/20 hover:border-ink/40 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98] overflow-hidden shrink-0 cursor-pointer text-xs font-bold font-sansation"
              title="Sign in with Google in real-time"
            >
              {/* Left Chamber: Google 4-Color SVG */}
              <div className="flex items-center justify-center px-2.5 sm:px-3 py-2 bg-ink/[0.03] group-hover:bg-ink/[0.06] border-r border-ink/15 transition-colors">
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <div className="flex items-center justify-center px-3 sm:px-3.5 py-2 tracking-wide whitespace-nowrap">
                <span className="hidden sm:inline">Sign In with Google</span>
                <span className="sm:hidden">Sign In</span>
              </div>
            </button>
          )}

          {currentView === 'wizard' && onTogglePreviewDrawer && (
            <button
              onClick={onTogglePreviewDrawer}
              className={`group flex items-stretch rounded-xl border transition-all active:scale-[0.98] overflow-hidden shrink-0 cursor-pointer text-xs font-medium ${
                isPreviewDrawerOpen
                  ? 'bg-ink text-white border-ink'
                  : 'bg-white text-ink border-ink/20 hover:border-ink/40 hover:bg-ink/[0.03]'
              }`}
              title="Toggle Live Website Preview"
            >
              <div
                className={`flex items-center justify-center px-2.5 py-2 border-r transition-colors ${
                  isPreviewDrawerOpen ? 'border-white/20 bg-white/10' : 'border-ink/15 bg-ink/[0.03]'
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className="flex items-center justify-center px-3 py-2 whitespace-nowrap">
                {isPreviewDrawerOpen ? 'Hide' : 'Preview'}
              </div>
            </button>
          )}

          {currentView !== 'wizard' ? (
            /* Split-Chamber "Create Design System" with + SVG */
            <button
              onClick={() => onNavigate('wizard')}
              className="group flex items-stretch rounded-xl bg-clay hover:bg-clay-deep text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden shrink-0 cursor-pointer text-xs font-bold font-sansation"
              title="Create a new website design system"
            >
              {/* Left Chamber: + SVG */}
              <div className="flex items-center justify-center px-3 py-2 bg-black/10 group-hover:bg-black/15 border-r border-white/25 transition-colors">
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
              {/* Right Chamber: Label */}
              <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 tracking-wide whitespace-nowrap">
                <span className="hidden sm:inline">Create Design System</span>
                <span className="sm:hidden">Create System</span>
              </div>
            </button>
          ) : (
            /* Split-Chamber "Review & Export" with Export SVG */
            <button
              onClick={() => onNavigate('workspace')}
              className="group flex items-stretch rounded-xl bg-clay hover:bg-clay-deep text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] overflow-hidden shrink-0 cursor-pointer text-xs font-bold font-sansation"
            >
              <div className="flex items-center justify-center px-3 py-2 bg-black/10 group-hover:bg-black/15 border-r border-white/25 transition-colors">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <div className="flex items-center justify-center px-3.5 sm:px-4 py-2 tracking-wide whitespace-nowrap">
                Review & Export
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
