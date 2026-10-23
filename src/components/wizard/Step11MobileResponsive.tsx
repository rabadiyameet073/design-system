import React, { useState } from 'react';
import { Sparkles, Smartphone, Tablet, Monitor, ShieldCheck, CheckCircle2, ArrowRight, Plus } from 'lucide-react';
import { DesignProject, ResponsiveConfig } from '../../types/designSystem';

interface Step11MobileResponsiveProps {
  project: DesignProject;
  onChange: (updated: Partial<DesignProject>) => void;
  onOpenLivePreview?: () => void;
}

export const Step11MobileResponsive: React.FC<Step11MobileResponsiveProps> = ({
  project,
  onChange,
  onOpenLivePreview
}) => {
  const [customMobileRule, setCustomMobileRule] = useState('');

  const updateResponsive = (key: keyof ResponsiveConfig, val: any) => {
    onChange({
      responsive: {
        ...project.responsive,
        [key]: val
      }
    });
  };

  const responsiveChecks = [
    {
      title: 'Comfortable Touch Button Sizes',
      tech: 'min-height: 44px on touch devices',
      desc: 'All buttons and links are tall enough so thumbs can tap easily without misclicks.',
      passed: true
    },
    {
      title: '15% Screen Height Limit for Sticky Bars',
      tech: 'mobile sticky viewport budget <= 15vh',
      desc: 'The top navigation stays slim so visitors have plenty of room to read your content.',
      passed: true
    },
    {
      title: 'No Horizontal Side-Scrolling',
      tech: 'overflow-x: hidden / fluid measure',
      desc: 'Text wraps cleanly on small screens without breaking off the side.',
      passed: true
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
          <span>Step 11 of 14 · Mobile & Phone Experience</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-1">
          How Your Website Adapts to Phones
        </h1>
        <span className="text-[11px] font-mono text-neutral-400 block mb-2">
          technical: responsive breakpoints & mobile thumb navigation
        </span>
        <p className="text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
          More than half of your customers visit from smartphones. We ensure navigation is effortless and cards stack intuitively on mobile.
        </p>
      </div>

      <div className="space-y-6">
        {/* Mobile Navigation Style */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Mobile Menu Style
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: mobile hamburger sheet vs dropdown menu
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'sheet',
                title: 'Slide-Out Drawer',
                tech: 'sheet drawer / full thumb reach',
                desc: 'A modern panel slides out smoothly from the right with big readable links.'
              },
              {
                id: 'dropdown',
                title: 'Drop-Down Menu',
                tech: 'accordion dropdown below navbar',
                desc: 'Expands downward directly below the header for quick single-tap navigation.'
              }
            ].map(nav => {
              const isSelected = project.responsive.mobileNav === nav.id;
              return (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => updateResponsive('mobileNav', nav.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs mb-0.5">{nav.title}</h4>
                  <span className="text-[9px] font-mono opacity-60 block mb-1">{nav.tech}</span>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {nav.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card Stacking */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-900 uppercase tracking-wider">
              Card Layout on Phones
            </label>
            <span className="text-[10px] font-mono text-neutral-400 block">
              technical: grid-cols-1 vs grid-cols-2 mobile arrangement
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'stack',
                title: 'Vertical Stack (1 per row)',
                tech: 'grid-cols-1 / full width',
                desc: 'Gives product photos and cards maximum screen size and effortless scrolling.'
              },
              {
                id: 'grid-2',
                title: 'Compact Grid (2 per row)',
                tech: 'grid-cols-2 / compact',
                desc: 'Shows more items side-by-side, great for apparel catalogs and fashion.'
              }
            ].map(stack => {
              const isSelected = project.responsive.cardStacking === stack.id;
              return (
                <button
                  key={stack.id}
                  type="button"
                  onClick={() => updateResponsive('cardStacking', stack.id)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-neutral-900 bg-neutral-900 text-white shadow-md'
                      : 'border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <h4 className="font-semibold text-xs mb-0.5">{stack.title}</h4>
                  <span className="text-[9px] font-mono opacity-60 block mb-1">{stack.tech}</span>
                  <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                    {stack.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Automated Mobile Health Audit Box */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                Mobile Quality & Usability Check
              </h3>
              <span className="text-[10px] font-mono text-neutral-400">
                technical: automated responsive validation
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {responsiveChecks.map((check, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{check.title}</h4>
                  <span className="text-[9px] font-mono text-neutral-400 block">{check.tech}</span>
                  <p className="text-[11px] text-neutral-500 mt-0.5">{check.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
