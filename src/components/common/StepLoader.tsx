import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

interface StepLoaderProps {
  label?: string;
}

export const StepLoader: React.FC<StepLoaderProps> = ({
  label = 'Loading design studio...'
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full h-full min-h-[360px] flex flex-col items-center justify-center p-8 gap-4 select-none"
    >
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shadow-inner animate-pulse">
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <Loader2 className="absolute -inset-1 w-14 h-14 text-amber-500/40 animate-spin" />
      </div>

      <div className="text-center space-y-1">
        <p className="text-xs font-semibold text-neutral-800 tracking-wide uppercase">
          {label}
        </p>
        <p className="text-[11px] text-neutral-400">
          Preparing responsive tokens & preview modules
        </p>
      </div>
    </div>
  );
};
