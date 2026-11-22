import React from 'react';
import { Calendar, Users, ArrowRight } from 'lucide-react';

export interface BookingWidgetProps {
  id?: string;
}

export const BookingWidget: React.FC<BookingWidgetProps> = ({ id = 'booking' }) => {
  return (
    <section
      id={id}
      className="w-full py-16 px-6 sm:px-12 border-t"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-default)'
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-action-primary)] font-[var(--font-mono)]">
            Reservations
          </span>
          <h2
            className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Curate Your Culinary or Hospitality Residency
          </h2>
        </div>

        <div
          className="p-6 border shadow-[var(--shadow-md)] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center"
          style={{
            backgroundColor: 'var(--color-bg-default)',
            borderColor: 'var(--color-border-default)',
            borderRadius: 'var(--radius-card, var(--radius-xl))'
          }}
        >
          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--color-fg-muted)]">Check In Date</label>
            <div className="flex items-center gap-2 p-2.5 border bg-[var(--color-bg-surface)] text-xs font-medium text-[var(--color-fg-default)]"
              style={{
                borderColor: 'var(--color-border-default)',
                borderRadius: 'var(--radius-input, var(--radius-md))'
              }}
            >
              <Calendar className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>Nov 12, 2026</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-[var(--color-fg-muted)]">Guests</label>
            <div className="flex items-center gap-2 p-2.5 border bg-[var(--color-bg-surface)] text-xs font-medium text-[var(--color-fg-default)]"
              style={{
                borderColor: 'var(--color-border-default)',
                borderRadius: 'var(--radius-input, var(--radius-md))'
              }}
            >
              <Users className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>2 Adults • Deluxe Suite</span>
            </div>
          </div>

          <div className="sm:self-end">
            <button
              className="w-full py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-[var(--shadow-sm)] hover:opacity-90 active:scale-98 cursor-pointer"
              style={{
                backgroundColor: 'var(--button-bg, var(--color-action-primary))',
                color: 'var(--button-fg, var(--color-action-primary-fg))',
                border: 'var(--button-border, none)',
                borderRadius: 'var(--radius-button, var(--radius-md))',
                fontFamily: 'var(--font-ui, var(--font-body))'
              }}
            >
              <span>Reserve Suite</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

