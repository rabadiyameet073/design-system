import React from 'react';
import { ChevronLeft, ChevronRight, Check, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { WizardStepId, WizardStepMeta } from '../../types/designSystem';

export const WIZARD_STEPS: WizardStepMeta[] = [
  { number: 1, title: 'Project Setup', subtitle: 'Name and initial goal', category: 'Foundation', estimatedMinutes: 1 },
  { number: 2, title: 'Website Type', subtitle: 'Choose your website genre', category: 'Foundation', estimatedMinutes: 2 },
  { number: 3, title: 'Business Discovery', subtitle: 'Audience and offerings', category: 'Foundation', estimatedMinutes: 2 },
  { number: 4, title: 'Brand Personality', subtitle: 'How your brand should feel', category: 'Identity', estimatedMinutes: 2 },
  { number: 5, title: 'Visual Direction', subtitle: 'Aesthetic mood and tone', category: 'Identity', estimatedMinutes: 2 },
  { number: 6, title: 'Color Studio', subtitle: 'Palette and semantic colors', category: 'Style', estimatedMinutes: 3 },
  { number: 7, title: 'Typography Studio', subtitle: 'Fonts and scale hierarchy', category: 'Style', estimatedMinutes: 3 },
  { number: 8, title: 'Website Imagery', subtitle: 'Photography and visual assets', category: 'Style', estimatedMinutes: 2 },
  { number: 9, title: 'Layout & Spacing', subtitle: 'Density and structure', category: 'Structure', estimatedMinutes: 2 },
  { number: 10, title: 'Website Components', subtitle: 'Buttons, cards, and patterns', category: 'Components', estimatedMinutes: 3 },
  { number: 11, title: 'Mobile & Responsive', subtitle: 'Phone, tablet, and desktop', category: 'Responsive', estimatedMinutes: 2 },
  { number: 12, title: 'Themes & Accessibility', subtitle: 'Dark mode & WCAG contrast', category: 'Quality', estimatedMinutes: 2 },
  { number: 13, title: 'Final Design Review', subtitle: 'Holistic system inspection', category: 'Review', estimatedMinutes: 2 },
  { number: 14, title: 'Export Center', subtitle: 'Download PDF, code, & prompt', category: 'Export', estimatedMinutes: 1 }
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

          {/* Center: Quick step pill list (scrollable on medium screens) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto py-1">
            {WIZARD_STEPS.map(step => {
              const isCurrent = step.number === currentStep;
              const isCompleted = completedSteps.includes(step.number);

              return (
                <button
                  key={step.number}
                  onClick={() => onSelectStep(step.number)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-colors flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : isCompleted
                      ? 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                      : 'text-neutral-400 hover:text-neutral-700'
                  }`}
                  title={`${step.number}. ${step.title}`}
                >
                  {isCompleted && !isCurrent ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    step.number
                  )}
                </button>
              );
            })}
          </div>

          {/* Right: Actions (Back, Reset, Continue) */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
            {onResetStep && (
              <button
                type="button"
                onClick={onResetStep}
                className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors"
                title="Reset this step to defaults"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {onSkip && currentStep < 13 && (
              <button
                type="button"
                onClick={onSkip}
                className="px-3 py-2 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                title="Skip to next step with recommended defaults"
              >
                Skip step
              </button>
            )}

            <button
              type="button"
              onClick={onBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-1 px-3.5 py-2 text-xs font-medium rounded-lg border transition-colors ${
                currentStep === 1
                  ? 'text-neutral-300 border-neutral-200 cursor-not-allowed'
                  : 'text-neutral-700 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={!canContinue}
              className={`flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all shadow-xs ${
                canContinue
                  ? 'bg-neutral-900 hover:bg-neutral-800 active:scale-[0.99]'
                  : 'bg-neutral-300 cursor-not-allowed'
              }`}
            >
              <span>{continueLabel}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
