import React from 'react';

export interface FooterProps {
  id?: string;
  brandName?: string;
}

export const Footer: React.FC<FooterProps> = ({
  id = 'site-footer',
  brandName = 'Studio Atelier'
}) => {
  return (
    <footer
      id={id}
      className="w-full py-12 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)',
        color: 'var(--color-fg-muted)'
      }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="w-6 h-6 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-xs"
            style={{
              backgroundColor: 'var(--color-action-primary)',
              color: 'var(--color-action-primary-fg)'
            }}
          >
            {brandName.charAt(0)}
          </div>
          <span
            className="font-bold text-sm text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {brandName}
          </span>
        </div>

        <p className="text-xs text-[var(--color-fg-muted)] font-[var(--font-body)]">
          © {new Date().getFullYear()} {brandName}. Rendered with dynamic design tokens.
        </p>

        <div className="flex items-center gap-4 text-xs">
          <span className="hover:text-[var(--color-fg-default)] transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-[var(--color-fg-default)] transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-[var(--color-fg-default)] transition-colors cursor-pointer">Accessibility</span>
        </div>
      </div>
    </footer>
  );
};
