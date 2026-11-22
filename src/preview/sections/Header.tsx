import React from 'react';
import { ShoppingBag, ArrowRight, Menu } from 'lucide-react';

export interface HeaderProps {
  id?: string;
  brandName?: string;
  links?: Array<{ label: string; href?: string }>;
  actionLabel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  id = 'site-header',
  brandName = 'Studio Atelier',
  links = [
    { label: 'Collection' },
    { label: 'Artisans' },
    { label: 'Philosophy' },
    { label: 'Stores' }
  ],
  actionLabel = 'Shop Now'
}) => {
  return (
    <header
      id={id}
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: 'var(--color-bg-default)',
        borderColor: 'var(--color-border-default)',
        color: 'var(--color-fg-default)'
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center font-bold text-sm shadow-[var(--shadow-sm)]"
            style={{
              backgroundColor: 'var(--color-action-primary)',
              color: 'var(--color-action-primary-fg)'
            }}
          >
            {brandName.charAt(0)}
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {brandName}
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((link, idx) => (
            <span
              key={idx}
              className="text-sm font-medium hover:opacity-100 opacity-80 transition-opacity cursor-pointer"
              style={{ color: 'var(--color-fg-default)', fontFamily: 'var(--font-ui, var(--font-body))' }}
            >
              {link.label}
            </span>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2 text-xs font-semibold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 active:scale-95 cursor-pointer"
            style={{
              backgroundColor: 'var(--color-action-primary)',
              color: 'var(--color-action-primary-fg)',
              borderRadius: 'var(--radius-button, var(--radius-md))',
              fontFamily: 'var(--font-ui, var(--font-body))'
            }}
          >
            {actionLabel}
          </button>
        </div>
      </div>
    </header>
  );
};

