export interface WebsiteTypeDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  designTips: string;
  recommendedDirection: string;
  recommendedPaletteId: string;
  defaultComponents: string[];
}

export const WEBSITE_TYPES: WebsiteTypeDefinition[] = [
  {
    id: 'ecommerce',
    name: 'Online Store & E-commerce',
    category: 'Commerce',
    description: 'Sell physical or artisan products with high-trust checkout, product showcases, and clear shopping flows.',
    designTips: 'Focus on clean product photography, legible prices, and high-contrast call-to-actions.',
    recommendedDirection: 'modern-product',
    recommendedPaletteId: 'warm-terracotta',
    defaultComponents: ['product-card', 'pricing-tag', 'cart-drawer', 'reviews-grid', 'newsletter']
  },
  {
    id: 'fashion',
    name: 'Fashion & Clothing Brand',
    category: 'Commerce',
    description: 'Apparel, accessories, and streetwear with lifestyle imagery, lookbooks, and seasonal collections.',
    designTips: 'Generous whitespace, editorial typography, and high-fashion aspect ratios.',
    recommendedDirection: 'minimal-editorial',
    recommendedPaletteId: 'monochrome-luxury',
    defaultComponents: ['lookbook-grid', 'product-card', 'size-selector', 'instagram-feed']
  },
  {
    id: 'electronics',
    name: 'Electronics & Technology Store',
    category: 'Commerce',
    description: 'Hardware, gadgets, audio gear, and computer peripherals with technical specifications.',
    designTips: 'Crisp high-contrast metrics, spec comparison tables, and modern dark surfaces.',
    recommendedDirection: 'clean-tech',
    recommendedPaletteId: 'slate-cyan',
    defaultComponents: ['product-card', 'spec-table', 'feature-callout', 'warranty-badge']
  },
  {
    id: 'beauty',
    name: 'Beauty & Skincare Store',
    category: 'Commerce',
    description: 'Cosmetics, skincare routines, organic serums, and wellness products.',
    designTips: 'Soft neutral tones, organic curved radii, and warm natural lighting.',
    recommendedDirection: 'soft-neutral',
    recommendedPaletteId: 'blush-sand',
    defaultComponents: ['ingredient-spotlight', 'product-card', 'routine-step', 'customer-review']
  },
  {
    id: 'luxury',
    name: 'Luxury & Premium Brand',
    category: 'Commerce',
    description: 'High-end watches, fine jewelry, haute couture, and bespoke luxury services.',
    designTips: 'Restrained color palette, serif display typography, deliberate pacing, and micro-details.',
    recommendedDirection: 'premium-luxury',
    recommendedPaletteId: 'champagne-noir',
    defaultComponents: ['heritage-story', 'curated-showcase', 'concierge-cta', 'craftsmanship-card']
  },
  {
    id: 'education-platform',
    name: 'Education Platform',
    category: 'Education',
    description: 'Online learning academies, educational resources, and certificate programs.',
    designTips: 'High legibility, structured course modules, and motivating progress indicators.',
    recommendedDirection: 'balanced-academic',
    recommendedPaletteId: 'scholar-navy',
    defaultComponents: ['course-card', 'curriculum-accordion', 'instructor-bio', 'certificate-badge']
  },
  {
    id: 'online-course',
    name: 'Online Course & LMS',
    category: 'Education',
    description: 'Single or multi-instructor video courses, cohort bootcamps, and digital masterclasses.',
    designTips: 'Clear lesson roadmap, student testimonials, and prominent enrollment dates.',
    recommendedDirection: 'warm-approachable',
    recommendedPaletteId: 'amber-focus',
    defaultComponents: ['course-card', 'syllabus-tree', 'video-preview', 'pricing-tier']
  },
  {
    id: 'university',
    name: 'School, College or University',
    category: 'Education',
    description: 'Institutional websites for schools, departments, research laboratories, and campuses.',
    designTips: 'Trustworthy corporate-academic structure, announcements board, and intuitive navigation.',
    recommendedDirection: 'clean-corporate',
    recommendedPaletteId: 'oxford-crimson',
    defaultComponents: ['announcements-feed', 'faculty-directory', 'program-finder', 'campus-tour']
  },
  {
    id: 'academic-research',
    name: 'Research & Academic Website',
    category: 'Education',
    description: 'Scientific research groups, lab publications, grant projects, and preprint archives.',
    designTips: 'Strict tabular data, author bibliographies, and clear download citations.',
    recommendedDirection: 'academic-thoughtful',
    recommendedPaletteId: 'deep-emerald',
    defaultComponents: ['paper-card', 'citation-box', 'lab-members', 'grant-stat']
  },
  {
    id: 'saas-product',
    name: 'SaaS Product',
    category: 'Software & Technology',
    description: 'Cloud software, productivity tools, automation workflows, and subscription web apps.',
    designTips: 'Interactive product mockups, feature benefits linked to user goals, and straightforward pricing tiers.',
    recommendedDirection: 'modern-product',
    recommendedPaletteId: 'indigo-flow',
    defaultComponents: ['feature-grid', 'pricing-matrix', 'metrics-row', 'integrations-cloud', 'interactive-demo']
  },
  {
    id: 'ai-tool',
    name: 'AI Tool & AI Application',
    category: 'Software & Technology',
    description: 'Generative AI products, smart assistants, ML models, and workflow copilots.',
    designTips: 'Sleek modern lines, clear before-and-after demonstration, prompt input preview, and response speed highlights.',
    recommendedDirection: 'clean-tech',
    recommendedPaletteId: 'electric-teal',
    defaultComponents: ['prompt-preview', 'output-comparison', 'latency-metric', 'use-case-tabs']
  },
  {
    id: 'admin-dashboard',
    name: 'Analytics & Admin Dashboard',
    category: 'Software & Technology',
    description: 'Data platforms, business intelligence tools, executive KPIs, and internal portals.',
    designTips: 'High-density grids, tabular numerals, clean subtle borders, and zero decorative clutter.',
    recommendedDirection: 'data-focused',
    recommendedPaletteId: 'slate-cyan',
    defaultComponents: ['kpi-stat', 'metric-table', 'segmented-filter', 'status-badge']
  },
  {
    id: 'personal-portfolio',
    name: 'Personal Portfolio',
    category: 'Portfolio & Creative',
    description: 'Individual professionals, consultants, writers, and specialists showcasing work and expertise.',
    designTips: 'Authentic narrative, curated selected projects, and direct contact options.',
    recommendedDirection: 'minimal-editorial',
    recommendedPaletteId: 'editorial-sand',
    defaultComponents: ['bio-lead', 'project-card', 'experience-timeline', 'contact-block']
  },
  {
    id: 'developer-portfolio',
    name: 'Developer Portfolio',
    category: 'Portfolio & Creative',
    description: 'Software engineers, open-source maintainers, and technical architects.',
    designTips: 'Monospace code snippets, GitHub activity highlights, project architecture briefs.',
    recommendedDirection: 'clean-tech',
    recommendedPaletteId: 'terminal-dark',
    defaultComponents: ['code-snippet', 'github-repo', 'tech-stack-list', 'live-demo-link']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'Portfolio & Creative',
    description: 'Visual designers, 3D artists, art directors, and creative technologists.',
    designTips: 'Large-scale visual canvas, seamless project transitions, and restrained UI controls.',
    recommendedDirection: 'artistic-portfolio',
    recommendedPaletteId: 'monochrome-luxury',
    defaultComponents: ['masonry-gallery', 'case-study-hero', 'client-roster', 'award-list']
  },
  {
    id: 'corporate-business',
    name: 'Corporate Business Website',
    category: 'Business & Agency',
    description: 'Established enterprises, consulting firms, manufacturing, and legal practices.',
    designTips: 'Authoritative, calm, structured layouts with transparent leadership and compliance info.',
    recommendedDirection: 'clean-corporate',
    recommendedPaletteId: 'corporate-navy',
    defaultComponents: ['services-grid', 'leadership-team', 'case-study', 'contact-inquiry']
  },
  {
    id: 'digital-agency',
    name: 'Digital Agency & Studio',
    category: 'Business & Agency',
    description: 'Branding agencies, web development studios, growth marketing teams, and design firms.',
    designTips: 'Bold typographic confidence, proof of results, and client testimonials.',
    recommendedDirection: 'bold-commercial',
    recommendedPaletteId: 'tangerine-energy',
    defaultComponents: ['showreel-card', 'service-accordion', 'client-metrics', 'pitch-form']
  },
  {
    id: 'startup-landing',
    name: 'Startup Landing Page',
    category: 'Business & Agency',
    description: 'Early-stage venture, pre-launch waitlist, seed round announcement, or MVP launch.',
    designTips: 'Crisp value proposition in 5 seconds, email capture with instant confirmation, and validation proof.',
    recommendedDirection: 'modern-product',
    recommendedPaletteId: 'indigo-flow',
    defaultComponents: ['hero-waitlist', 'problem-solution', 'feature-spotlight', 'founder-note']
  },
  {
    id: 'blog-editorial',
    name: 'Blog & Editorial Website',
    category: 'Publishing & Media',
    description: 'Long-form publications, opinion essays, independent newsletters, and technical writing.',
    designTips: 'Optimal reading line length (65-75ch), comfortable line height, and distraction-free layout.',
    recommendedDirection: 'minimal-editorial',
    recommendedPaletteId: 'editorial-sand',
    defaultComponents: ['article-card', 'featured-story', 'author-byline', 'newsletter-embed']
  },
  {
    id: 'news-media',
    name: 'News & Media Portal',
    category: 'Publishing & Media',
    description: 'Breaking news, magazine features, video interviews, and categorized journalistic reporting.',
    designTips: 'Dense multi-column layout with clear typographic hierarchy and timestamps.',
    recommendedDirection: 'clean-corporate',
    recommendedPaletteId: 'corporate-navy',
    defaultComponents: ['headline-banner', 'story-list', 'video-module', 'trending-sidebar']
  },
  {
    id: 'restaurant',
    name: 'Restaurant & Hospitality',
    category: 'Local & Services',
    description: 'Bistros, fine dining, cocktail lounges, cafes, and boutique hotels.',
    designTips: 'Atmospheric photography, structured menus with dietary marks, and reservation bookings.',
    recommendedDirection: 'warm-approachable',
    recommendedPaletteId: 'warm-terracotta',
    defaultComponents: ['menu-section', 'reservation-picker', 'chef-story', 'hours-location']
  },
  {
    id: 'travel-booking',
    name: 'Travel & Boutique Booking',
    category: 'Local & Services',
    description: 'Destination retreats, tour experiences, villa rentals, and expedition guides.',
    designTips: 'Full-bleed scenic vistas, itinerary timelines, and pricing calendar widgets.',
    recommendedDirection: 'nature-inspired',
    recommendedPaletteId: 'forest-clay',
    defaultComponents: ['stay-card', 'date-search', 'itinerary-timeline', 'amenities-grid']
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Wellness',
    category: 'Local & Services',
    description: 'Medical practices, therapy clinics, dental care, physical wellness, and health tech.',
    designTips: 'Reassuring soft tones, accessibility first, provider credentials, and patient booking.',
    recommendedDirection: 'warm-approachable',
    recommendedPaletteId: 'sage-mint',
    defaultComponents: ['appointment-booking', 'practitioner-card', 'service-faq', 'clinic-hours']
  },
  {
    id: 'fintech',
    name: 'Finance & Fintech',
    category: 'Finance & Legal',
    description: 'Payment APIs, investment apps, wealth management, insurance, and banking.',
    designTips: 'Security trust indicators, verified compliance badges, transparent fees, and precise metrics.',
    recommendedDirection: 'clean-corporate',
    recommendedPaletteId: 'corporate-navy',
    defaultComponents: ['security-badge', 'fee-calculator', 'comparison-table', 'compliance-footer']
  },
  {
    id: 'real-estate',
    name: 'Real Estate & Properties',
    category: 'Property & Spaces',
    description: 'Residential listings, commercial leasing, luxury developments, and architectural realty.',
    designTips: 'High-res gallery cards, key property metrics (beds, baths, sqft), and map integration.',
    recommendedDirection: 'premium-luxury',
    recommendedPaletteId: 'champagne-noir',
    defaultComponents: ['property-card', 'filter-bar', 'virtual-tour-link', 'agent-card']
  },
  {
    id: 'marketplace',
    name: 'Marketplace Platform',
    category: 'Platform & Community',
    description: 'Peer-to-peer commerce, freelance contractor platforms, and service directories.',
    designTips: 'Faceted search, seller ratings, multi-category navigation, and buyer guarantees.',
    recommendedDirection: 'modern-product',
    recommendedPaletteId: 'indigo-flow',
    defaultComponents: ['search-hero', 'category-tiles', 'seller-badge', 'review-card']
  },
  {
    id: 'community',
    name: 'Community & Forum Platform',
    category: 'Platform & Community',
    description: 'Member clubs, discussion boards, alumni networks, and interest group hubs.',
    designTips: 'Active member avatars, discussion threads, event calendars, and join badges.',
    recommendedDirection: 'warm-approachable',
    recommendedPaletteId: 'tangerine-energy',
    defaultComponents: ['member-spotlight', 'event-card', 'discussion-row', 'join-cta']
  },
  {
    id: 'nonprofit',
    name: 'Nonprofit & NGO',
    category: 'Mission & Society',
    description: 'Charitable trusts, humanitarian causes, conservation initiatives, and civic projects.',
    designTips: 'Empathetic storytelling, clear impact statistics, and transparent donation tiers.',
    recommendedDirection: 'nature-inspired',
    recommendedPaletteId: 'forest-clay',
    defaultComponents: ['impact-counter', 'donation-tier', 'mission-story', 'volunteer-form']
  },
  {
    id: 'event-website',
    name: 'Event & Conference Website',
    category: 'Events & Media',
    description: 'Tech summits, music festivals, design conferences, and webinar schedules.',
    designTips: 'Speaker lineup grid, multi-track agenda timetable, ticket tiers, and countdown.',
    recommendedDirection: 'bold-commercial',
    recommendedPaletteId: 'electric-teal',
    defaultComponents: ['speaker-grid', 'agenda-timeline', 'ticket-card', 'venue-map']
  },
  {
    id: 'documentation',
    name: 'Documentation & Knowledge Base',
    category: 'Software & Technology',
    description: 'Developer APIs, product user manuals, SDK references, and help centers.',
    designTips: 'Sidebar search, breadcrumbs, copyable code snippets, and next/prev page guides.',
    recommendedDirection: 'clean-tech',
    recommendedPaletteId: 'terminal-dark',
    defaultComponents: ['search-input', 'doc-navigation', 'code-block', 'feedback-widget']
  },
  {
    id: 'job-board',
    name: 'Recruitment & Job Board',
    category: 'Platform & Community',
    description: 'Tech careers, remote work listings, executive search, and internship portals.',
    designTips: 'Quick filter tags, salary transparency tags, bookmarking, and 1-click apply.',
    recommendedDirection: 'clean-corporate',
    recommendedPaletteId: 'indigo-flow',
    defaultComponents: ['job-listing-row', 'salary-badge', 'company-card', 'apply-modal']
  },
  {
    id: 'membership',
    name: 'Membership & Subscription',
    category: 'Commerce',
    description: 'Private newsletter circles, VIP clubs, Patreon-style patron tiers, and gym passes.',
    designTips: 'Perk comparison grids, member badge previews, and friction-free payment.',
    recommendedDirection: 'modern-product',
    recommendedPaletteId: 'champagne-noir',
    defaultComponents: ['tier-card', 'perk-checklist', 'member-testimonials', 'faq-accordion']
  },
  {
    id: 'custom',
    name: 'Other / Custom Business Website',
    category: 'General',
    description: 'A completely bespoke website designed to match your unique brand identity.',
    designTips: 'Flexible modular layouts tailored to your exact founder vision.',
    recommendedDirection: 'balanced-modern',
    recommendedPaletteId: 'warm-terracotta',
    defaultComponents: ['hero-banner', 'features-grid', 'cta-card', 'footer-links']
  }
];

export const CATEGORIES = [
  'All Categories',
  'Commerce',
  'Software & Technology',
  'Education',
  'Portfolio & Creative',
  'Business & Agency',
  'Local & Services',
  'Publishing & Media',
  'Platform & Community',
  'General'
];
