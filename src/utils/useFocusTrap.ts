import { useEffect, useRef } from 'react';

/**
 * Accessible Focus Trap Hook (WCAG 2.2 SC 2.4.3 & 2.1.2)
 *
 * Traps keyboard focus inside the modal dialog while open,
 * listens for the Escape key to close the modal, and restores focus
 * to the original trigger element upon dismissal.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  isOpen: boolean,
  onClose?: () => void
) {
  const containerRef = useRef<T | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Cache the triggering element to restore focus upon close
    triggerRef.current = document.activeElement as HTMLElement | null;

    const el = containerRef.current;
    if (!el) return;

    const focusableSelector =
      'button:not([disabled]):not([aria-hidden="true"]), ' +
      '[href]:not([aria-hidden="true"]), ' +
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"]), ' +
      'select:not([disabled]):not([aria-hidden="true"]), ' +
      'textarea:not([disabled]):not([aria-hidden="true"]), ' +
      '[tabindex]:not([tabindex="-1"]):not([disabled]):not([aria-hidden="true"])';

    // Focus the first focusable element inside the modal
    const focusTimer = setTimeout(() => {
      if (!containerRef.current) return;
      const focusables = containerRef.current.querySelectorAll<HTMLElement>(focusableSelector);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        containerRef.current.focus();
      }
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;

      if (e.key === 'Escape' && onClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const currentFocusables = Array.from(
          containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
        ).filter(node => node.offsetParent !== null); // Filter visible elements

        if (currentFocusables.length === 0) {
          e.preventDefault();
          return;
        }

        const first = currentFocusables[0];
        const last = currentFocusables[currentFocusables.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !containerRef.current.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown, true);

      // Restore focus to original element that opened the modal
      if (triggerRef.current && typeof triggerRef.current.focus === 'function') {
        setTimeout(() => {
          try {
            triggerRef.current?.focus();
          } catch {
            // Ignore if element is no longer mounted
          }
        }, 20);
      }
    };
  }, [isOpen, onClose]);

  return containerRef;
}
