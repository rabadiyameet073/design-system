import React from 'react';
import { Target, Sparkles, Compass } from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface Step1ProjectInitProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
}

export const Step1ProjectInit: React.FC<Step1ProjectInitProps> = ({ project, onChange }) => {
  const handleNameChange = (name: string) => {
    onChange({
      name,
      business: {
        ...project.business,
        name
      }
    });
  };

  const commonGoals = [
    'Sell products online & convert visitors to buyers',
    'Showcase creative portfolio & book high-value clients',
    'Launch a SaaS product & drive trial signups',
    'Educate students & enroll members in online courses',
    'Build trust for a professional consulting business',
    'Grow an email newsletter & community membership'
  ];

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 1 of 14 · Quick Start</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Name Your Design Project
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          Every great website starts with clarity. Tell us what your business or project is called and what you want to achieve.
        </p>
      </div>

      <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 space-y-6 shadow-xs">
        {/* Project & Business Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
            What is your business or website called? <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={project.name}
            onChange={e => handleNameChange(e.target.value)}
            placeholder="e.g. Komorebi Ceramics, Apex Logistics, Aura Health..."
            className="w-full px-4 py-3 text-sm text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white transition-all"
          />
          <p className="text-xs text-neutral-500 mt-1.5">
            You can always rename this project anytime in your dashboard.
          </p>
        </div>

        {/* Primary Goal */}
        <div>
          <label className="block text-xs font-semibold text-neutral-800 uppercase tracking-wider mb-2">
            What is the primary goal of this website?
          </label>
          <div className="space-y-2 mb-3">
            {commonGoals.map(goal => {
              const isSelected = project.business.primaryGoal === goal;
              return (
                <button
                  key={goal}
                  type="button"
                  onClick={() =>
                    onChange({
                      business: {
                        ...project.business,
                        primaryGoal: goal
                      }
                    })
                  }
                  className={`w-full text-left p-3 rounded-lg border text-xs md:text-sm transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white font-medium'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
                >
                  <span>{goal}</span>
                  {isSelected && <Target className="w-4 h-4 shrink-0 text-white" />}
                </button>
              );
            })}

            {/* Other / Custom Goal button */}
            <div
              className={`p-3 rounded-lg border transition-all ${
                !commonGoals.includes(project.business.primaryGoal) && project.business.primaryGoal.length > 0
                  ? 'border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-neutral-900">
                  Other / Custom Website Goal
                </span>
                {!commonGoals.includes(project.business.primaryGoal) && project.business.primaryGoal.length > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-900 text-white">
                    Custom Goal Active
                  </span>
                )}
              </div>
              <input
                type="text"
                value={commonGoals.includes(project.business.primaryGoal) ? '' : project.business.primaryGoal}
                onChange={e =>
                  onChange({
                    business: {
                      ...project.business,
                      primaryGoal: e.target.value
                    }
                  })
                }
                placeholder="Type your own custom goal (e.g. Schedule private wine tasting tours, recruit PhD researchers...)"
                className="w-full px-3 py-2 text-xs text-neutral-900 bg-white border border-neutral-200 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
          </div>
        </div>

        {/* Encouraging Tip */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex items-start gap-3 text-xs text-neutral-600">
          <Compass className="w-4 h-4 text-neutral-800 shrink-0 mt-0.5" />
          <p>
            No technical knowledge needed. In the next steps, we will guide you through choosing your website type, visual personality, and colors — one simple decision at a time.
          </p>
        </div>
      </div>
    </div>
  );
};
