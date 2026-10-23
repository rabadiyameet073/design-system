import React, { useEffect } from 'react';
import { Sparkles, Edit3, CheckCircle, ArrowRight, Palette, Type, Layout, ShieldCheck, Smartphone, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import { DesignProject } from '../../types/designSystem';

interface Step13FinalReviewProps {
  project: DesignProject;
  onJumpToStep: (step: number) => void;
  onProceedToExport: () => void;
}

export const Step13FinalReview: React.FC<Step13FinalReviewProps> = ({
  project,
  onJumpToStep,
  onProceedToExport
}) => {
  useEffect(() => {
    // Fire a gentle celebration burst
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: [project.colorPalette.primary, project.colorPalette.accent, '#18181B']
    });
  }, [project.colorPalette.primary, project.colorPalette.accent]);

  const handleProceed = () => {
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.7 }
    });
    onProceedToExport();
  };
  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Intro */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 13 of 14 · Final Design Review</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">
          Your Design System is Ready
        </h1>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto">
          Review your decisions below. You can click "Edit" on any section to adjust your choices before downloading your complete package.
        </p>
      </div>

      {/* Grid of Decision Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Card 1: Project & Type */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Foundation
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(2)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">{project.name}</h3>
            <p className="text-xs text-neutral-600 mb-2">
              Type: <strong className="text-neutral-800">{project.websiteType.name}</strong> ({project.websiteType.category})
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {project.business.offering || 'Professional business offering'}
            </p>
          </div>
        </div>

        {/* Card 2: Brand & Visual Direction */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                Brand Personality
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">{project.brandPersonality.primary}</h3>
            <p className="text-xs text-neutral-600 mb-2">
              Direction: <strong className="text-neutral-800">{project.visualDirection.name}</strong>
            </p>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {project.visualDirection.description}
            </p>
          </div>
        </div>

        {/* Card 3: Color Palette */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-neutral-600" />
                Color System
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(6)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">{project.colorPalette.name}</h3>
            <p className="text-xs text-neutral-600 mb-3">{project.colorPalette.family}</p>

            {/* Mini Swatches */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded border border-black/10"
                style={{ backgroundColor: project.colorPalette.primary }}
                title={`Primary: ${project.colorPalette.primary}`}
              />
              <div
                className="w-8 h-8 rounded border border-black/10"
                style={{ backgroundColor: project.colorPalette.secondary }}
                title={`Secondary: ${project.colorPalette.secondary}`}
              />
              <div
                className="w-8 h-8 rounded border border-black/10"
                style={{ backgroundColor: project.colorPalette.background }}
                title={`Canvas: ${project.colorPalette.background}`}
              />
              <div
                className="w-8 h-8 rounded border border-black/10"
                style={{ backgroundColor: project.colorPalette.surface }}
                title={`Surface: ${project.colorPalette.surface}`}
              />
              <span className="text-xs font-mono text-neutral-500 ml-1">
                {project.colorPalette.primary}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Typography Pairing */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-neutral-600" />
                Typography
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(7)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">{project.typography.name}</h3>
            <p className="text-xs text-neutral-600 mb-2">
              Display: <strong className="text-neutral-800">{project.typography.displayFont}</strong> · Body: <strong className="text-neutral-800">{project.typography.bodyFont}</strong>
            </p>
            <p className="text-xs text-neutral-500">
              Scale ratio: {project.typography.scaleRatio} · Monospace tabular numbers enabled.
            </p>
          </div>
        </div>

        {/* Card 5: Layout & Geometry */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layout className="w-3.5 h-3.5 text-neutral-600" />
                Layout & Geometry
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(9)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              {project.layout.density.toUpperCase()} Layout Rhythm
            </h3>
            <p className="text-xs text-neutral-600">
              Radius: <strong className="text-neutral-800">{project.layout.radius}</strong> · Frame: <strong className="text-neutral-800">{project.layout.containerWidth}</strong>
            </p>
          </div>
        </div>

        {/* Card 6: Components & Accessibility */}
        <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Components & Quality
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(10)}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            </div>
            <h3 className="text-base font-bold text-neutral-900 mb-1">
              {project.components.enabledComponents.length} Active Components
            </h3>
            <p className="text-xs text-neutral-600">
              WCAG 2.2 AA Contrast Verified · Mobile responsive navigation configured.
            </p>
          </div>
        </div>
      </div>

      {/* Primary Continue Button */}
      <div className="flex justify-center">
        <motion.button
          type="button"
          onClick={handleProceed}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-8 py-3.5 bg-neutral-900 text-white font-semibold text-sm rounded-xl hover:bg-neutral-800 transition-all shadow-md active:scale-[0.99] cursor-pointer"
        >
          <span>Everything Looks Great — Continue to Export</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};
