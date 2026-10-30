import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Command, Keyboard } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const shortcuts = [
    { keys: ['→'], description: 'Proceed to next wizard step' },
    { keys: ['←'], description: 'Return to previous wizard step' },
    { keys: [cmdKey, 'Z'], description: 'Undo last design token modification' },
    { keys: [cmdKey, 'Shift', 'Z'], description: 'Redo previously undone change' },
    { keys: ['D'], description: 'Toggle live template between Light & Dark mode' },
    { keys: ['C'], description: 'Toggle draft preview / live comparison' },
    { keys: ['Esc'], description: 'Close modals & dismiss active overlays' },
    { keys: ['?'], description: 'Open this keyboard shortcuts cheat-sheet' }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-2xl p-6 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">Studio Keyboard Shortcuts</h3>
                <span className="text-[11px] text-neutral-500">Power-user navigation & controls</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Shortcuts List */}
          <div className="py-4 space-y-2.5">
            {shortcuts.map((sc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <span className="text-xs text-neutral-700">{sc.description}</span>
                <div className="flex items-center gap-1 shrink-0">
                  {sc.keys.map((k, kIdx) => (
                    <kbd
                      key={kIdx}
                      className="inline-flex items-center justify-center min-w-[22px] px-1.5 h-6 text-[11px] font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-300 rounded shadow-2xs"
                    >
                      {k}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Press <kbd className="px-1 py-0.5 bg-neutral-100 rounded text-neutral-600 font-mono">?</kbd> anywhere to toggle</span>
            <button
              onClick={onClose}
              className="px-3 py-1 bg-neutral-900 text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
