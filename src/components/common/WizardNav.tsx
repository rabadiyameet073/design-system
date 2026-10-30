import React from 'react';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { WizardStepMeta } from '../../types/designSystem';

export const WIZARD_STEPS: WizardStepMeta[] = [
  { number: 1, title: 'Category & Genre', subtitle: 'Template opens immediately', category: 'Foundation', estimatedMinutes: 1 },
  { number: 2, title: 'Project Scope', subtitle: 'Brand, audience & scripts', category: 'Foundation', estimatedMinutes: 2 },
  { number: 3, title: 'Brand Personality', subtitle: 'Temperament dials & presets', category: 'Identity', estimatedMinutes: 2 },
  { number: 4, title: 'Visual Direction', subtitle: 'Aesthetic mood and tone', category: 'Identity', estimatedMinutes: 2 },
  { number: 5, title: 'Color Studio', subtitle: 'OKLCH scales & semantic mapping', category: 'Style', estimatedMinutes: 3 },
  { number: 6, title: 'Typography Studio', subtitle: 'Font API, pairing & fluid scale', category: 'Style', estimatedMinutes: 3 },
  { number: 7, title: 'Shape & Spacing', subtitle: 'Radius, density & elevation', category: 'Structure', estimatedMinutes: 2 },
  { number: 8, title: 'Website Components', subtitle: 'Button states, cards & inputs', category: 'Components', estimatedMinutes: 2 },
  { number: 9, title: 'Imagery & Motion', subtitle: 'Photo filters, icons & springs', category: 'Motion', estimatedMinutes: 2 },
  { number: 10, title: 'Review & Audit', subtitle: 'WCAG 2.2 AA table & auto-fix', category: 'Quality', estimatedMinutes: 2 },
  { number: 11, title: 'Export Center', subtitle: '10 formats & starter ZIP', category: 'Export', estimatedMinutes: 1 }
];

interface WizardNavProps {
  currentStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  onResetStep?: () => void;
  canContinue?: boolean;
  continueLabel?: string;
  isAutosaving?: boolean;
}

export const WizardNav: React.FC<WizardNavProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
  onNext,
  onBack,
  onSkip,
  onResetStep,
  canContinue = true,
  continueLabel = 'Continue',
  isAutosaving = false
}) => {
  const currentStepMeta = WIZARD_STEPS.find(s => s.number === currentStep) || WIZARD_STEPS[0];
  const progressPercent = Math.round((currentStep / WIZARD_STEPS.length) * 100);

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-16 z-30">
      {/* Top micro progress track with fluid motion */}
      <div className="w-full bg-neutral-100 h-1 overflow-hidden">
        <motion.div
          className="bg-neutral-900 h-1"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left: Step indicator and title */}
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentStep}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>Step {currentStep} of {WIZARD_STEPS.length}</span>
                <span aria-hidden="true">·</span>
                <span>{currentStepMeta.category}</span>
                <span aria-hidden="true">·</span>
                <span>{isAutosaving ? 'Saving...' : 'Saved to browser'}</span>
              </div>
              <h2 className="text-base font-semibold text-neutral-900 leading-snug">
                {currentStepMeta.title}
              </h2>
            </div>
          </div>

          {/* Center: Quick step pill list */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
            {WIZARD_STEPS.map(step => {
              const isCurrent = step.number === currentStep;
              const isCompleted = completedSteps.includes(step.number);

              return (
                <button
                  key={step.number}
                  onClick={() => onSelectStep(step.number)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors flex items-center justify-center shrink-0 cursor-pointer ${
                    isCurrent
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title={`${step.number}. ${step.title}`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    step.number
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Step Action Buttons */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {onResetStep && (
              <button
                onClick={onResetStep}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                title="Reset step to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {currentStep > 1 && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={onNext}
              disabled={!canContinue}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                canContinue
                  ? 'bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === WIZARD_STEPS.length ? 'Finish & Export' : continueLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
