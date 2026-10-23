import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  ShoppingBag,
  ArrowRight,
  Star,
  Check,
  ShieldCheck,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { DesignProject } from '../../types/designSystem';

interface LiveWebsitePreviewProps {
  project: DesignProject;
  initialViewport?: 'mobile' | 'tablet' | 'desktop';
  isEmbedded?: boolean;
}

export const LiveWebsitePreview: React.FC<LiveWebsitePreviewProps> = ({
  project,
  initialViewport = 'desktop',
  isEmbedded = false
}) => {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>(initialViewport);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(project.accessibility.defaultTheme === 'dark' ? 'dark' : 'light');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cartCount, setCartCount] = useState(2);
  const [activeTab, setActiveTab] = useState('overview');

  // Compute inline styles based on design tokens
  const isDark = themeMode === 'dark';
  const bgColor = isDark ? '#0F172A' : project.colorPalette.background;
  const bgAltColor = isDark ? '#1E293B' : project.colorPalette.backgroundAlt;
  const surfaceColor = isDark ? '#1E293B' : project.colorPalette.surface;
  const borderColor = isDark ? '#334155' : project.colorPalette.surfaceBorder;
  const textPrimary = isDark ? '#F8FAFC' : project.colorPalette.textPrimary;
  const textSecondary = isDark ? '#94A3B8' : project.colorPalette.textSecondary;
  const textMuted = isDark ? '#64748B' : project.colorPalette.textMuted;
  const primaryColor = project.colorPalette.primary;

  // Corner radius calculation
  const getRadiusClass = (type: 'button' | 'card' | 'input') => {
    switch (project.layout.radius) {
      case 'sharp':
        return 'rounded-none';
      case 'subtle':
        return type === 'button' ? 'rounded-md' : 'rounded-lg';
      case 'playful':
        return type === 'button' ? 'rounded-full' : 'rounded-2xl';
      case 'rounded':
      default:
        return type === 'button' ? 'rounded-lg' : 'rounded-xl';
    }
  };

  // Button style class
  const getButtonClass = () => {
    const base = `px-4 py-2 font-medium text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 ${getRadiusClass('button')}`;
    if (project.components.buttonStyle === 'outline') {
      return `${base} border-2 bg-transparent hover:opacity-90`;
    }
    if (project.components.buttonStyle === 'subtle') {
      return `${base} bg-opacity-15 hover:bg-opacity-25`;
    }
    return `${base} text-white shadow-xs hover:opacity-90 active:scale-[0.99]`;
  };

  // Viewport width styling
  const getContainerWidth = () => {
    switch (viewport) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'desktop':
      default:
        return 'max-w-full';
    }
  };

  const heroImage =
    project.imagery.customHeroUrl ||
    (project.websiteType.category === 'Commerce' || project.websiteType.id === 'restaurant'
      ? '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg'
      : project.websiteType.category === 'Software & Technology' || project.websiteType.category === 'Finance & Legal'
      ? '/src/assets/images/preview_saas_metrics_1792316645998.jpg'
      : project.websiteType.category === 'Portfolio & Creative' || project.websiteType.category === 'Publishing & Media' || project.websiteType.category === 'Education'
      ? '/src/assets/images/preview_editorial_arch_1792316647413.jpg'
      : '/src/assets/images/hero_founder_studio_1792316645323.jpg');

  const getActionText = (isMobile: boolean) => {
    const cat = project.websiteType.category;
    const id = project.websiteType.id;
    if (cat === 'Commerce') return isMobile ? 'Shop' : 'Shop Collection';
    if (id === 'restaurant') return isMobile ? 'Reserve' : 'Reserve Table';
    if (cat === 'Software & Technology') return isMobile ? 'Trial' : 'Start Free Trial';
    if (cat === 'Portfolio & Creative') return isMobile ? 'Inquire' : 'Work With Us';
    if (cat === 'Education') return isMobile ? 'Enroll' : 'Explore Courses';
    if (cat === 'Business & Agency') return isMobile ? 'Book' : 'Book Discovery Call';
    if (cat === 'Finance & Legal') return isMobile ? 'Open' : 'Open Account';
    if (cat === 'Property & Spaces') return isMobile ? 'Tour' : 'Schedule Tour';
    if (cat === 'Publishing & Media') return isMobile ? 'Read' : 'Subscribe Free';
    return isMobile ? 'Contact' : 'Get In Touch';
  };

  const getNavItems = () => {
    const cat = project.websiteType.category;
    const id = project.websiteType.id;
    if (cat === 'Commerce') return { tab2: 'Collection', tab3: 'Artisans' };
    if (id === 'restaurant') return { tab2: 'Menu & Cellar', tab3: 'Private Dining' };
    if (cat === 'Software & Technology') return { tab2: 'Features', tab3: 'Pricing' };
    if (cat === 'Portfolio & Creative') return { tab2: 'Selected Works', tab3: 'Exhibitions' };
    if (cat === 'Education') return { tab2: 'Curriculum', tab3: 'Faculty' };
    if (cat === 'Business & Agency') return { tab2: 'Services', tab3: 'Case Studies' };
    if (cat === 'Finance & Legal') return { tab2: 'Infrastructure', tab3: 'Security & Rates' };
    if (cat === 'Property & Spaces') return { tab2: 'Residences', tab3: 'Floorplans' };
    if (cat === 'Publishing & Media') return { tab2: 'Essays & Issues', tab3: 'Archives' };
    return { tab2: 'Capabilities', tab3: 'Process' };
  };

  const getFeatureHeading = () => {
    const cat = project.websiteType.category;
    const id = project.websiteType.id;
    if (id === 'restaurant') return 'Seasonal Hearth Gastronomy';
    if (cat === 'Commerce') return 'Curated Studio Drops';
    if (cat === 'Software & Technology') return 'Engineered for Performance & Scale';
    if (cat === 'Portfolio & Creative') return 'Selected Works & Commissions';
    if (cat === 'Education') return 'Mastery-Driven Curriculum';
    if (cat === 'Business & Agency') return 'High-Impact Client Solutions';
    if (cat === 'Finance & Legal') return 'Bank-Grade Security & Protocol';
    if (cat === 'Property & Spaces') return 'Architectural Distinction';
    if (cat === 'Publishing & Media') return 'Critical Essays & Publications';
    return 'Production-Grade Architecture';
  };

  return (
    <div
      className={`flex flex-col bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ${
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'w-full h-full'
      }`}
    >
      {/* Top Device & Frame Bar */}
      <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 shadow-2xs transition-opacity hover:opacity-80" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 shadow-2xs transition-opacity hover:opacity-80" />
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 shadow-2xs transition-opacity hover:opacity-80 cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            />
          </div>
          <span className="text-xs text-neutral-400 font-medium ml-2 truncate max-w-[180px]">
            {project.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com
          </span>
        </div>

        {/* Viewport Toggles */}
        <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800">
          <button
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Desktop 1440px"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Tablet 768px"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded transition-colors ${
              viewport === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Theme & Fullscreen controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            title={`Switch to ${isDark ? 'Light' : 'Dark'} theme`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Website Viewport Stage */}
      <div className="flex-1 overflow-y-auto bg-neutral-900/60 p-2 md:p-6 flex justify-center items-start">
        <div
          className={`w-full transition-all duration-300 shadow-xl overflow-hidden ${getContainerWidth()} ${
            viewport === 'mobile' ? 'rounded-2xl border-4 border-neutral-800' : 'rounded-lg'
          }`}
          style={{
            backgroundColor: bgColor,
            color: textPrimary,
            fontFamily: project.typography.bodyFont
          }}
        >
          {/* Simulated Website Header */}
          <header
            className="border-b px-5 py-3.5 flex items-center justify-between gap-6"
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor
            }}
          >
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="font-bold text-sm sm:text-base tracking-tight truncate max-w-[180px] sm:max-w-none"
                style={{
                  fontFamily: project.typography.displayFont,
                  color: textPrimary
                }}
              >
                {project.business.name || project.name}
              </span>
            </div>

            {viewport !== 'mobile' && (
              <nav className="flex items-center gap-5 text-xs font-medium" style={{ color: textSecondary }}>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`hover:opacity-100 transition-opacity ${
                    activeTab === 'overview' ? 'font-semibold' : 'opacity-75'
                  }`}
                  style={{ color: activeTab === 'overview' ? textPrimary : textSecondary }}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('features')}
                  className={`hover:opacity-100 transition-opacity ${
                    activeTab === 'features' ? 'font-semibold' : 'opacity-75'
                  }`}
                  style={{ color: activeTab === 'features' ? textPrimary : textSecondary }}
                >
                  {getNavItems().tab2}
                </button>
                <button
                  onClick={() => setActiveTab('story')}
                  className={`hover:opacity-100 transition-opacity ${
                    activeTab === 'story' ? 'font-semibold' : 'opacity-75'
                  }`}
                  style={{ color: activeTab === 'story' ? textPrimary : textSecondary }}
                >
                  {getNavItems().tab3}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`hover:opacity-100 transition-opacity ${
                    activeTab === 'reviews' ? 'font-semibold' : 'opacity-75'
                  }`}
                  style={{ color: activeTab === 'reviews' ? textPrimary : textSecondary }}
                >
                  Reviews
                </button>
              </nav>
            )}

            <div className="flex items-center gap-3 shrink-0">
              {project.websiteType.category === 'Commerce' && (
                <button
                  onClick={() => setCartCount(c => c + 1)}
                  className="relative p-1.5 rounded-md hover:opacity-80 transition-opacity"
                  style={{ color: textPrimary }}
                  title="Shopping cart"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center tabular-nums"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {cartCount}
                  </span>
                </button>
              )}
              <button
                className={getButtonClass()}
                style={{
                  backgroundColor:
                    project.components.buttonStyle === 'outline'
                      ? 'transparent'
                      : primaryColor,
                  color: project.components.buttonStyle === 'outline' ? primaryColor : '#FFFFFF',
                  borderColor: primaryColor
                }}
              >
                <span>{getActionText(viewport === 'mobile')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </header>

          {/* Hero Section */}
          <section className={`px-5 sm:px-6 ${viewport === 'mobile' ? 'py-8' : 'py-12 md:py-16'}`}>
            <div
              className={`grid gap-6 sm:gap-8 items-center ${
                viewport === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'
              }`}
            >
              <div>
                <div
                  className="text-xs font-semibold mb-3 tracking-wide uppercase flex items-center gap-2"
                  style={{ color: primaryColor }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{project.visualDirection.name}</span>
                </div>
                <h1
                  className={`${
                    viewport === 'mobile' ? 'text-xl' : 'text-2xl md:text-4xl'
                  } font-bold tracking-tight mb-4 leading-tight text-balance`}
                  style={{
                    fontFamily: project.typography.headingFont,
                    color: textPrimary
                  }}
                >
                  {project.business.offering
                    ? project.business.offering.split('.')[0]
                    : `Thoughtful Design for ${project.name}`}
                </h1>
                <p
                  className={`${
                    viewport === 'mobile' ? 'text-xs' : 'text-sm md:text-base'
                  } mb-6 leading-relaxed`}
                  style={{ color: textSecondary, maxWidth: '60ch' }}
                >
                  {project.business.audience
                    ? `Crafted specifically for ${project.business.audience}. Experience seamless consistency with zero friction.`
                    : 'Personalized website design systems that unite brand identity, accessible typography, and production components.'}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className={getButtonClass()}
                    style={{
                      backgroundColor: primaryColor,
                      color: '#FFFFFF'
                    }}
                  >
                    <span>{project.business.primaryGoal.split(' ')[0] || 'Explore'} Today</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className={`px-4 py-2 text-xs font-medium border transition-colors ${getRadiusClass('button')}`}
                    style={{
                      borderColor: borderColor,
                      color: textPrimary,
                      backgroundColor: surfaceColor
                    }}
                  >
                    Learn More
                  </button>
                </div>

                {/* Social Proof adjacency */}
                <div className="mt-8 pt-6 border-t flex items-center gap-4 text-xs" style={{ borderColor: borderColor, color: textSecondary }}>
                  <div className="flex text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span className="font-medium text-neutral-400">
                    Trusted by over <strong className="tabular-nums" style={{ color: textPrimary }}>1,400+</strong> founders
                  </span>
                </div>
              </div>

              {/* Hero Image / Media Card */}
              <div
                className={`overflow-hidden border shadow-sm relative ${getRadiusClass('card')}`}
                style={{
                  backgroundColor: surfaceColor,
                  borderColor: borderColor
                }}
              >
                <img
                  src={heroImage}
                  alt={`${project.name} showcase`}
                  referrerPolicy="no-referrer"
                  className={`w-full ${viewport === 'mobile' ? 'h-48' : 'h-56 md:h-80'} object-cover`}
                />
                <div
                  className="p-4 flex items-center justify-between border-t"
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor
                  }}
                >
                  <div>
                    <h3 className="font-semibold text-xs" style={{ color: textPrimary }}>
                      {project.websiteType.name}
                    </h3>
                    <p className="text-[11px]" style={{ color: textSecondary }}>
                      {project.brandPersonality.primary}
                    </p>
                  </div>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded tabular-nums"
                    style={{
                      backgroundColor: isDark ? '#334155' : project.colorPalette.shades[100],
                      color: primaryColor
                    }}
                  >
                    Live System
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Showcase Grid */}
          <section
            className={`px-5 sm:px-6 ${viewport === 'mobile' ? 'py-8' : 'py-12'} border-t`}
            style={{
              backgroundColor: bgAltColor,
              borderColor: borderColor
            }}
          >
            <div className="max-w-4xl mx-auto mb-6 sm:mb-8 text-center">
              <h2
                className={`${
                  viewport === 'mobile' ? 'text-lg' : 'text-xl md:text-2xl'
                } font-bold tracking-tight mb-2`}
                style={{
                  fontFamily: project.typography.headingFont,
                  color: textPrimary
                }}
              >
                {getFeatureHeading()}
              </h2>
              <p className="text-xs md:text-sm" style={{ color: textSecondary }}>
                Consistent design tokens applied across cards, typography, and interactive buttons.
              </p>
            </div>

            <div
              className={`grid gap-4 sm:gap-5 ${
                viewport === 'mobile'
                  ? 'grid-cols-1'
                  : viewport === 'tablet'
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              }`}
            >
              {[1, 2, 3].map(item => (
                <div
                  key={item}
                  className={`p-5 border transition-all ${getRadiusClass('card')}`}
                  style={{
                    backgroundColor: surfaceColor,
                    borderColor: borderColor
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      backgroundColor: isDark ? '#334155' : project.colorPalette.shades[100],
                      color: primaryColor
                    }}
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: textPrimary }}>
                    {item === 1
                      ? 'Zero-Slop Typography'
                      : item === 2
                      ? 'Harmonious Color Ramp'
                      : 'Accessible Contrast'}
                  </h3>
                  <p className="text-xs leading-relaxed mb-4" style={{ color: textSecondary }}>
                    {item === 1
                      ? `Pairing ${project.typography.displayFont} with ${project.typography.bodyFont} for natural reading rhythm.`
                      : item === 2
                      ? `Structured 60-30-10 distribution using ${project.colorPalette.name}.`
                      : 'Passes WCAG 2.2 AA specifications with legible contrast ratios.'}
                  </p>
                  <div className="pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: borderColor }}>
                    <span className="font-mono tabular-nums text-[11px]" style={{ color: textMuted }}>
                      TOKEN_0{item}
                    </span>
                    <span className="font-medium" style={{ color: primaryColor }}>
                      Verified · AA
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Simple Website Footer */}
          <footer
            className={`px-5 sm:px-6 py-6 sm:py-7 border-t flex flex-col ${
              viewport === 'mobile'
                ? 'items-start gap-3.5 text-left'
                : 'sm:flex-row sm:items-center sm:justify-between gap-4 text-left'
            } text-xs`}
            style={{
              backgroundColor: surfaceColor,
              borderColor: borderColor,
              color: textSecondary
            }}
          >
            <div className="space-y-1.5 max-w-full">
              <p className="font-medium text-xs leading-relaxed" style={{ color: textPrimary }}>
                © {new Date().getFullYear()} {project.business.name || project.name}. All rights reserved.
              </p>
              <p className="text-[11px] leading-relaxed opacity-85" style={{ color: textMuted }}>
                Design tokens active: {project.colorPalette.name} · {project.typography.name}
              </p>
            </div>
            <div
              className={`flex items-center gap-5 text-xs font-medium ${
                viewport === 'mobile'
                  ? 'w-full pt-3 border-t justify-start'
                  : 'shrink-0'
              }`}
              style={{ borderColor: borderColor }}
            >
              <span className="hover:opacity-80 cursor-pointer transition-opacity">Privacy</span>
              <span className="hover:opacity-80 cursor-pointer transition-opacity">Terms</span>
              <span className="hover:opacity-80 cursor-pointer transition-opacity">Contact</span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
