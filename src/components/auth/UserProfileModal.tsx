import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  User,
  Mail,
  Shield,
  Layers,
  LogOut,
  Sparkles,
  Copy,
  Check,
  Calendar,
  Database,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFocusTrap } from '../../utils/useFocusTrap';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectsCount?: number;
  onNavigateToProjects?: () => void;
  onStartNewDesign?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  projectsCount = 0,
  onNavigateToProjects,
  onStartNewDesign
}) => {
  const { user, logout } = useAuth();
  const [copiedId, setCopiedId] = useState(false);
  const modalRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen || !user) return null;

  const handleCopyUserId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleLogoutClick = () => {
    onClose();
    logout();
  };

  const authDate = user.authenticatedAt
    ? new Date(user.authenticatedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Active Session';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto bg-black/60 backdrop-blur-xs font-sans"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl shadow-2xl border border-neutral-200/90 max-w-[440px] w-full max-h-[92vh] overflow-y-auto p-6 sm:p-7 relative focus:outline-none"
        tabIndex={-1}
      >
        {/* Subtle Ambient Top Accent Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-clay/20 via-rose-500/10 to-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 p-2 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          aria-label="Close profile modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Profile Header */}
        <div className="flex items-start gap-4 pt-1">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl border-2 border-white shadow-md object-cover bg-neutral-100"
            />
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center"
              title="Session Active & Connected"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
          </div>

          <div className="flex-1 min-w-0 pt-0.5">
            <div className="flex items-center gap-2">
              <h2 id="user-profile-title" className="text-lg font-bold text-neutral-900 truncate">
                {user.name}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 truncate mt-0.5">{user.email}</p>

            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Session Verified</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200 uppercase">
                {user.provider}
              </span>
            </div>
          </div>
        </div>

        {/* User Details & Telemetry Grid */}
        <div className="mt-6 space-y-2.5">
          {/* Account ID Pill */}
          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                Account ID
              </span>
              <p className="font-mono text-neutral-800 text-xs font-semibold truncate max-w-[260px]">
                {user.id}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyUserId}
              className="p-1.5 text-neutral-500 hover:text-neutral-800 rounded-lg hover:bg-neutral-200/60 transition-colors cursor-pointer"
              title="Copy Account ID"
            >
              {copiedId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Layers className="w-3.5 h-3.5 text-clay" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Designs</span>
              </div>
              <p className="text-sm font-extrabold text-neutral-900 font-mono">
                {projectsCount} Saved
              </p>
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-0.5">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Storage</span>
              </div>
              <p className="text-sm font-extrabold text-neutral-900 font-mono">
                Backend JSON
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80 text-[11px] text-neutral-500 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span>Active session verified on {authDate}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 space-y-2">
          {onStartNewDesign && (
            <button
              onClick={() => {
                onClose();
                onStartNewDesign();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-clay hover:bg-clay-deep text-white text-xs font-bold tracking-wide transition-all shadow-md shadow-clay/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create New Design System</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onNavigateToProjects && (
            <button
              onClick={() => {
                onClose();
                onNavigateToProjects();
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              <span>View All My Saved Projects</span>
            </button>
          )}

          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-600" />
            <span>Sign Out of Studio</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
