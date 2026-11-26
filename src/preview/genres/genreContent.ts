/**
 * Genre content resolver (Doc 02 §4).
 *
 * The category copy files describe the *category* voice. A genre, however, must
 * open a visibly different site: its own brand, hero copy and offering cards.
 * This module keeps one compact seed per genre, resolves it together with the
 * category copy + GenreConfig defaults, and hands a single content object to
 * the selected template. Unknown / missing ids fall back to the flagship
 * ceramics seed so the preview can never break.
 */
import { CategoryId } from '../../tokens/types';
import { getGenreById } from './index';
import commerceCopy from './copy/commerce.json';
import saasCopy from './copy/saas.json';
import portfolioCopy from './copy/portfolio.json';
import publishingCopy from './copy/publishing.json';
import hospitalityCopy from './copy/hospitality.json';
import educationCopy from './copy/education.json';
import architectureCopy from './copy/architecture.json';
import financeCopy from './copy/finance.json';

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  specs: string[];
  image: string;
  badge?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  category?: string;
  colorways?: { name: string; hex: string }[];
}

export interface ContentHighlight {
  id: string;
  label: string;
  title: string;
  description: string;
  stats: { label: string; value: string }[];
}

export interface ContentQuote {
  quote: string;
  author: string;
  role: string;
  outlet?: string;
}

export interface ResolvedGenreContent {
  genreId: string;
  category: CategoryId;
  label: string;
  description: string;
  brandName: string;
  tagline: string;
  headline: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  primaryAction: string;
  secondaryAction: string;
  sectionTitle: string;
  sectionSubtitle: string;
  featuresTitle: string;
  featuresSubtitle: string;
  ctaTitle: string;
  ctaSubtitle: string;
  items: ContentItem[];
  highlights: ContentHighlight[];
  quotes: ContentQuote[];
  faqs: { q: string; a: string }[];
  ui?: Record<string, string>;
  scriptMeta?: {
    id: string;
    label: string;
    nativeLabel: string;
    lang: string;
    dir: 'ltr' | 'rtl';
  };
}

interface CategoryCopy {
  category: string;
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryAction: string;
    secondaryAction: string;
  };
  [key: string]: unknown;
}

const CATEGORY_COPY: Record<CategoryId, CategoryCopy> = {
  commerce: commerceCopy as CategoryCopy,
  saas: saasCopy as CategoryCopy,
  portfolio: portfolioCopy as CategoryCopy,
  publishing: publishingCopy as CategoryCopy,
  hospitality: hospitalityCopy as CategoryCopy,
  education: educationCopy as CategoryCopy,
  architecture: architectureCopy as CategoryCopy,
  finance: financeCopy as CategoryCopy
};

const IMAGES = [
  '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
  '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
  '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
  '/src/assets/images/hero_founder_studio_1792316645323.jpg'
];

interface ItemSeed {
  title: string;
  description: string;
  specs?: string[];
  badge?: string;
  price?: number;
}

interface GenreSeed {
  brandName: string;
  headline: string;
  subtitle: string;
  items: ItemSeed[];
  badge?: string;
  primaryAction?: string;
  secondaryAction?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  ctaTitle?: string;
}

const it = (title: string, description: string, specs: string[] = [], badge = '', price = 0): ItemSeed => ({
  title,
  description,
  specs,
  badge: badge || undefined,
  price: price || undefined
});

/** One distinct voice per genre — 4 genres × 8 categories = 32 entries. */
const GENRE_SEEDS: Record<string, GenreSeed> = {
  // ---------- COMMERCE ----------
  'ceramics-atelier': {
    brandName: 'KOMOREBI Ceramics Atelier',
    headline: 'Hand-thrown stoneware shaped by fire, mineral, and patience',
    subtitle: 'Small-batch vessels, tea sets, and table objects finished with wild-harvested ash glazes.',
    items: [
      it('Kohiki Tea Bowl', 'Wheel-thrown stoneware with a quiet, milky feldspar glaze.', ['Hand-thrown', 'Wood-fired', 'Ø 12 cm'], 'Studio Favorite', 68),
      it('Shino Pouring Vessel', 'A tall carafe with a dry white glaze that pools warmly at the foot.', ['Shino glaze', '1.1 L', 'Food safe'], 'Limited Batch', 120),
      it('Ash Glaze Dinner Set', 'Four plates and a serving bowl, each carrying a unique kiln flash.', ['Set of five', 'Iron-rich clay', 'Oven safe'], '', 240),
      it('Mineral Glaze Cup', 'A tactile espresso cup finished with volcanic ash and unglazed foot.', ['90 ml', 'Hand-carved', 'Lead free'], '', 32)
    ]
  },
  'fashion-store': {
    brandName: 'MAISON ÉLAN',
    headline: 'Editorial tailoring for the unhurried modern wardrobe',
    subtitle: 'Seasonless garments cut from Italian wool, silk, and organic cotton in a strictly limited atelier run.',
    items: [
      it('The Atelier Trench', 'Double-faced cotton gabardine with hand-finished edges and a dropped shoulder.', ['Italian cotton', 'Unlined', 'Made in Paris'], 'New Season', 890),
      it('Sculpted Wool Coat', 'A single-breasted silhouette cut from responsible virgin wool.', ['100% wool', 'Horn buttons', 'Limited run'], '', 1240),
      it('Silk Column Dress', 'Bias-cut mulberry silk that moves with the body rather than against it.', ['Bias cut', 'Mulberry silk', 'Made to order'], 'Atelier Pick', 720),
      it('Leather Folio', 'Vegetable-tanned calfskin, hand-stitched and designed to patina.', ['Veg-tanned', 'Hand-stitched', 'Lifetime repair'], '', 340)
    ]
  },
  'electronics-hardware': {
    brandName: 'NORTHLINE Acoustic Instruments',
    headline: 'Reference audio instruments machined for uncompromising clarity',
    subtitle: 'Anodized aluminum enclosures, planar transducers, and field-replaceable components built to last decades.',
    items: [
      it('Northline Reference One', 'Open-back planar headphones with a 50 mm beryllium diaphragm.', ['Planar magnetic', '32 Ω', 'Field-serviceable'], 'Flagship', 549),
      it('Monitor In-Ear', 'A four-driver hybrid monitor tuned for neutral studio translation.', ['4 drivers', 'Detachable cable', '-26 dB isolation'], '', 229),
      it('Discrete DAC Unit', 'A balanced R-2R ladder converter in a milled aluminum chassis.', ['32-bit / 768 kHz', 'Balanced out', 'Linear supply'], 'Audiophile', 620),
      it('Machined Stand', 'A weighted brass and oak cradle with wireless charging.', ['Solid brass', '15 W Qi2', 'Cable management'], '', 95)
    ]
  },
  'beauty-skincare': {
    brandName: 'BOTANIQUE Cellular Skincare',
    headline: 'Clinical formulations rooted in botanical intelligence',
    subtitle: 'Cold-pressed serums and barrier creams developed with dermatologists and grown without synthetic pesticides.',
    items: [
      it('Bakuchiol Renewal Serum', 'A gentle retinol alternative that smooths texture without irritation.', ['2% bakuchiol', 'Fragrance free', '30 ml'], 'Best Seller', 58),
      it('Cloudberry Barrier Cream', 'A cushioning moisturizer rich in omega-3 and plant sterols.', ['Barrier repair', 'All skin types', '50 ml'], '', 46),
      it('Green Tea Cleansing Milk', 'A low-foam cleanser that lifts sunscreen and pollution without stripping.', ['pH 5.5', 'Daily use', '150 ml'], '', 34),
      it('Mineral SPF Veil', 'A weightless zinc oxide veil with a soft, invisible finish.', ['Non-nano zinc', 'SPF 40', '50 ml'], 'New', 42)
    ]
  },

  // ---------- SAAS ----------
  'dashboard-app': {
    brandName: 'AXIOM Telemetry Cloud',
    headline: 'Operational telemetry that turns live signals into decisions',
    subtitle: 'Unified metrics, event streams, and incident response on a distributed zero-latency platform.',
    primaryAction: 'Open Console',
    items: [
      it('Realtime Pipeline', 'Ingest millions of events per second with sub-second query freshness.', ['< 400 ms p99', '12 regions', 'Auto-scale']),
      it('Metric Explorer', 'Slice any dimension without pre-aggregation or query rehearsal.', ['Ad-hoc slices', 'No sampling', 'Saved views']),
      it('Alert Rules', 'Route anomalies to the right on-call engineer with full context.', ['Multi-signal', 'Escalation paths', 'Silence windows']),
      it('Audit Ledger', 'Immutable, exportable history of every configuration change.', ['SOC 2', 'Immutable log', 'API export'])
    ]
  },
  'dev-tools': {
    brandName: 'FORGE Developer Platform',
    headline: 'The command-line platform for reproducible design systems',
    subtitle: 'Version, validate, and publish tokens from a monorepo without leaving the terminal.',
    primaryAction: 'Read the Docs',
    items: [
      it('Forge CLI', 'A single binary to scaffold, lint, and release token packages.', ['Zero config', 'Offline mode', 'Plugins']),
      it('Token Pipeline', 'Deterministic transforms from source tokens to CSS, Swift, and Kotlin.', ['Deterministic', '14 targets', 'Diffable output']),
      it('Monorepo Orchestrator', 'Task graphs that cache and replay only what actually changed.', ['Remote cache', 'Task graph', 'Parallel']),
      it('Type Registry', 'A typed contract shared by designers, engineers, and CI.', ['Type-safe', 'Schema aware', 'CI checks'])
    ]
  },
  'ai-product': {
    brandName: 'NEXUS Neural Workspace',
    headline: 'A workspace where autonomous agents and people build together',
    subtitle: 'Multimodal reasoning, persistent memory, and tool-using agents in one conversational surface.',
    badge: 'Autonomous Agent Runtime',
    primaryAction: 'Launch Workspace',
    secondaryAction: 'Explore Agents',
    sectionTitle: 'The Agent Studio',
    sectionSubtitle: 'Compose agents that can read, write, and ship alongside your team.',
    items: [
      it('Agent Runtime', 'Deploy long-running agents with bounded tools and observable traces.', ['Tool use', 'Trace viewer', 'Sandbox']),
      it('Multimodal Studio', 'Reason across documents, images, and structured data in one thread.', ['Text + vision', 'File context', 'Citations']),
      it('Prompt Foundry', 'Version, evaluate, and compare prompts against golden datasets.', ['Eval suites', 'Versioning', 'Regression checks']),
      it('Memory Graph', 'Give agents durable, permission-aware memory of your organization.', ['Scoped memory', 'Retrieval', 'Access control'])
    ]
  },
  'b2b-platform': {
    brandName: 'MERIDIAN Trade Network',
    headline: 'One coordination layer for multilateral global trade',
    subtitle: 'Connect suppliers, carriers, and buyers on a single compliance-aware ledger.',
    primaryAction: 'Request Access',
    items: [
      it('Supply Ledger', 'A shared record of orders, shipments, and custody handoffs.', ['Shared state', 'Real-time', 'Dispute ready']),
      it('Compliance Desk', 'Screen every counterparty against changing global regulations.', ['Sanctions', 'Document checks', 'Audit trail']),
      it('Partner Portal', 'A permissioned workspace for every participant in the network.', ['Role based', 'White label', 'SSO']),
      it('Settlement Rails', 'Reconcile invoices and payments across currencies automatically.', ['Multi-currency', 'Reconciliation', 'API first'])
    ]
  },

  // ---------- PORTFOLIO ----------
  'designer-portfolio': {
    brandName: 'STUDIO FOLD Monograph',
    headline: 'Interface systems and identities, documented with care',
    subtitle: 'A product design practice exploring typography, interaction, and the quiet mechanics of delightful software.',
    items: [
      it('Interface Systems', 'A scalable component language for a multi-product analytics suite.', ['Design tokens', '120 components', 'Case study']),
      it('Brand Identity', 'A typographic identity built for a research-led technology company.', ['Wordmark', 'Type system', 'Guidelines']),
      it('Editorial Platforms', 'Long-form reading experiences designed for deep attention.', ['Reading modes', 'Type scale', 'Accessibility']),
      it('Motion Language', 'A spring-based motion vocabulary that makes state changes legible.', ['Principles', 'Durations', 'Prototypes'])
    ]
  },
  'photographer-portfolio': {
    brandName: 'HALIDE Photographic Archive',
    headline: 'Medium-format studies of light, weather, and stillness',
    subtitle: 'An ongoing archive of landscapes and portraits made on film and printed by hand.',
    items: [
      it('Coastal Studies', 'A series documenting tidal light along the northern coastline.', ['Medium format', 'Silver gelatin', '2024']),
      it('Nocturne Series', 'Long exposures of cities after the last train has gone.', ['Long exposure', '35 mm', '2025']),
      it('Portrait Commissions', 'Quiet, natural-light portraits of makers and thinkers.', ['Available', 'Studio + location', 'Editorial']),
      it('Botanical Plates', 'Contact prints of specimens collected over four seasons.', ['Contact print', 'Archive pigment', 'Limited edition'])
    ]
  },
  'developer-portfolio': {
    brandName: 'NULLSPACE Engineering',
    headline: 'Systems, shaders, and tools for the open web',
    subtitle: 'Engineering notes and prototypes from a practice focused on rendering, compilers, and performance.',
    items: [
      it('WebGL Prototypes', 'Spatial interfaces that run at sixty frames on mid-range hardware.', ['WebGL', '60 fps', 'Source available']),
      it('Compiler Notes', 'Long-form writing on type systems and code generation.', ['Essays', 'Deep dives', 'Open access']),
      it('Open Source Tools', 'Small, sharp utilities for building and measuring interfaces.', ['MIT license', 'CI tested', 'Typed']),
      it('Systems Writing', 'Field reports from rebuilding design tooling from first principles.', ['Architecture', 'Tradeoffs', 'Benchmarks'])
    ]
  },
  'creative-agency': {
    brandName: 'OFFGRID Creative Direction',
    headline: 'Identities, campaigns, and spaces for ambitious organizations',
    subtitle: 'A multidisciplinary studio working across brand, digital products, and physical installations.',
    items: [
      it('Identity Systems', 'Flexible brand worlds with a clear point of view and real utility.', ['Strategy', 'Identity', 'Guidelines']),
      it('Launch Campaigns', 'Integrated launches that carry one idea across every channel.', ['Campaign', 'Content', 'Digital']),
      it('Spatial Installations', 'Touchable environments built for exhibitions and events.', ['Spatial', 'Fabrication', 'Wayfinding']),
      it('Digital Flagships', 'Websites designed as destinations rather than brochures.', ['Art direction', 'Web', 'Motion'])
    ]
  },

  // ---------- PUBLISHING ----------
  'literary-magazine': {
    brandName: 'MARGIN Literary Quarterly',
    headline: 'A quarterly journal for long attention and difficult questions',
    subtitle: 'Fiction, criticism, and essays on material culture, architecture, and the tools that shape thought.',
    items: [
      it('The Long Essay', 'A twelve-thousand-word investigation into the politics of repair.', ['Nonfiction', 'Issue 14', 'Read online']),
      it('Field Notes', 'Dispatches from workshops, quarries, and studios around the world.', ['Reporting', 'Photography', 'Series']),
      it('Criticism', 'Close readings of books that changed how we design and build.', ['Reviews', 'Essays', 'Archive']),
      it('New Fiction', 'Short stories from writers working at the edge of form.', ['Fiction', 'Debut', 'Print + digital'])
    ]
  },
  'tech-blog': {
    brandName: 'STACKTRACE Engineering Journal',
    headline: 'Deep technical writing for people who build the platform',
    subtitle: 'Compiler design, distributed systems, and interface architecture explained from the inside.',
    items: [
      it('Compiler Internals', 'How we lowered a token DSL to three target runtimes.', ['Compilers', 'Codegen', 'Benchmarks']),
      it('Distributed Systems', 'Notes on consensus, replication, and honest failure modes.', ['Consensus', 'Latency', 'Diagrams']),
      it('UI Architecture', 'A practical model for state, rendering, and streaming boundaries.', ['Rendering', 'State', 'Patterns']),
      it('Performance Work', 'Profiles, traces, and the small changes that actually moved p99.', ['Profiling', 'Traces', 'Results'])
    ]
  },
  'news-journal': {
    brandName: 'THE DISPATCH Daily',
    headline: 'Independent reporting with the time to follow the evidence',
    subtitle: 'Investigations, global briefings, and analysis published every morning.',
    items: [
      it('Investigations', 'A four-month inquiry into public infrastructure contracts.', ['Original reporting', 'Documents', 'Follow-up']),
      it('Global Briefing', 'The five developments that will shape the next twenty-four hours.', ['Daily', 'Verified', 'Concise']),
      it('Analysis', 'Context and consequences, written by reporters who know the beat.', ['Explainer', 'Data', 'Commentary']),
      it('Culture', 'How policy and technology change the way people actually live.', ['Features', 'Interviews', 'Photo'])
    ]
  },
  'curated-newsletter': {
    brandName: 'SUNDAY SIGNAL',
    headline: 'A considered weekly digest for curious makers',
    subtitle: 'Design theory, startup memos, and cultural recommendations, read by people who still read things.',
    badge: 'Curated Weekly Digest',
    primaryAction: 'Subscribe Free',
    items: [
      it('Design Theory', 'One idea from the week, explained without jargon.', ['Essay', '5 min read', 'Weekly']),
      it('Startup Memos', 'Founder letters worth reading in full, with the useful parts marked.', ['Memo', 'Annotated', 'Archive']),
      it('Reading List', 'Six links that reward more than a glance.', ['Curation', 'Links', 'Weekly']),
      it('Recommendations', 'A film, an object, and a place for the weekend.', ['Culture', 'Shortlist', 'Personal'])
    ]
  },

  // ---------- HOSPITALITY ----------
  'boutique-hotel': {
    brandName: 'CASA OLIVA Heritage Hotel',
    headline: 'A restored courtyard hotel with the pace of a private home',
    subtitle: 'Historic stone rooms, custom linens, and a walled garden hidden a few streets from the old town.',
    items: [
      it('Courtyard Suite', 'A double-height room opening directly onto the olive garden.', ['38 m²', 'Garden view', 'King bed']),
      it('Garden Terrace', 'Breakfast and evening aperitivo under the pergola.', ['Seasonal', 'Local produce', 'Open daily']),
      it('Library Bar', 'A quiet room of books, sherry, and low lamplight.', ['24 seats', 'Historic cellar', 'Evening']),
      it('Private Dining', 'A long table for twelve beneath the vaulted ceiling.', ['Chef menu', 'Wine pairing', 'By request'])
    ]
  },
  'fine-dining': {
    brandName: 'TABLE SEPTEM',
    headline: 'A tasting menu written by the season, not the calendar',
    subtitle: 'Foraged ingredients, rare cellar bottles, and a chef’s counter that seats only eight.',
    items: [
      it('Seven-Course Menu', 'A progression built around what arrived from the coast this morning.', ['Seven courses', 'Seasonal', '2 h 30 m']),
      it('Cellar Pairing', 'Seven pours chosen to meet each course, not overwhelm it.', ['Rare vintages', 'Sommelier led', 'Optional']),
      it('Chef’s Counter', 'A front-row seat at the pass with the kitchen team.', ['Eight seats', 'Interactive', 'Booking needed']),
      it('Garden Table', 'A private lunch among the kitchen beds in late summer.', ['Al fresco', 'Six courses', 'Limited dates'])
    ]
  },
  'artisanal-cafe': {
    brandName: 'EMBER & OAK Roastery',
    headline: 'Single-origin coffee roasted in small batches, every week',
    subtitle: 'A sunlit neighborhood café with a roastery at the back and a bakery at the front.',
    items: [
      it('Single-Origin Espresso', 'A rotating lot roasted for sweetness and a clean finish.', ['Weekly lot', 'Espresso', '12 oz']),
      it('Filter Flight', 'Three brew methods side by side, with tasting notes.', ['V60 + batch', 'Guided', 'Daily']),
      it('Sourdough Loaf', 'A 36-hour ferment, baked each morning in the café oven.', ['36 h ferment', 'Baked daily', 'Whole grain']),
      it('Pastry Case', 'Laminated pastries and seasonal fruit tarts made on site.', ['Small batch', 'Seasonal', 'While they last'])
    ]
  },
  'luxury-resort': {
    brandName: 'ALPINE VERGE Sanctuary',
    headline: 'Thermal baths and quiet chalets above the cloud line',
    subtitle: 'A restorative retreat of mineral springs, panoramic valleys, and unhurried days.',
    items: [
      it('Thermal Suite', 'Private mineral baths fed by the spring beneath the property.', ['Private', '32–38 °C', 'Daily']),
      it('Mountain Chalet', 'A freestanding timber chalet with a private sauna and terrace.', ['Two bedrooms', 'Sauna', 'Valley view']),
      it('Spa Ritual', 'A three-hour treatment drawn from local herbs and alpine oils.', ['Three hours', 'Two therapists', 'By booking']),
      it('Summit Dining', 'A slow dinner at 2,100 metres, reached by cable car.', ['Seven courses', 'Sunset', 'Seasonal'])
    ]
  },

  // ---------- EDUCATION ----------
  'online-masterclass': {
    brandName: 'ATELIER SIX Design School',
    headline: 'A practical masterclass in design engineering',
    subtitle: 'Twelve weeks of live studio sessions with practitioners who build the tools they teach.',
    items: [
      it('Systems Foundations', 'Tokens, scales, and the architecture of a coherent design system.', ['Six weeks', 'Live studio', 'Recorded']),
      it('Type Mastery', 'Variable fonts, fluid scales, and typography that holds up in production.', ['Three weeks', 'Exercises', 'Critique']),
      it('Portfolio Sprint', 'Turn a body of work into a case study people actually read.', ['Two weeks', '1:1 review', 'Templates']),
      it('Capstone Project', 'Ship a real system with feedback from working designers.', ['One week', 'Mentored', 'Certificate'])
    ]
  },
  'university-school': {
    brandName: 'INSTITUTE OF FORMS',
    headline: 'An accredited school for architecture, art, and making',
    subtitle: 'Degree programs taught in studios, workshops, and the city itself.',
    items: [
      it('Architecture Degree', 'A five-year studio-led program in design and construction.', ['Five years', 'Accredited', 'Studio based']),
      it('Studio Research', 'A fellowship for independent work with faculty supervision.', ['One year', 'Fellowship', 'Exhibition']),
      it('Public Exhibition', 'The annual show of student work, open to the city.', ['Annual', 'Free entry', 'All faculties']),
      it('Materials Lab', 'Hands-on work with timber, stone, and digital fabrication.', ['Workshop', 'Fabrication', 'Open access'])
    ]
  },
  'developer-bootcamp': {
    brandName: 'IRONCLAD Engineering Foundry',
    headline: 'A high-intensity path into production software engineering',
    subtitle: 'Sixteen weeks of code, review, and shipping with engineers who work in the industry.',
    items: [
      it('Foundations Track', 'Languages, tooling, and the habits of professional engineers.', ['Four weeks', 'Daily labs', 'Paired']),
      it('Systems Track', 'Databases, APIs, and the architecture behind real products.', ['Six weeks', 'Team builds', 'Reviewed']),
      it('Ship Week', 'A live launch with real users and real incident response.', ['One week', 'Production', 'On-call']),
      it('Career Lab', 'Interviews, portfolios, and a network that keeps opening doors.', ['Four weeks', '1:1 coaching', 'Alumni'])
    ]
  },
  'coaching-academy': {
    brandName: 'NORTHSTAR Leadership Collective',
    headline: 'A coaching practice for founders and people who lead them',
    subtitle: 'Small cohorts, direct feedback, and a peer group that tells you the truth.',
    items: [
      it('Mindset Lab', 'The habits and decision frameworks that hold under pressure.', ['Eight sessions', 'Cohort', 'Weekly']),
      it('Venture Strategy', 'Turn a rough thesis into a testable, fundable plan.', ['Six sessions', 'Framework', 'Review']),
      it('Founder Circle', 'A standing group of peers meeting every two weeks.', ['Bi-weekly', 'Confidential', 'Facilitated']),
      it('Performance Sprint', 'A focused four-week block on one constraint that matters.', ['Four weeks', '1:1', 'Measured'])
    ]
  },

  // ---------- ARCHITECTURE ----------
  'spatial-studio': {
    brandName: 'STUDIO LITHIC',
    headline: 'Buildings formed by raw stone, timber, and calibrated daylight',
    subtitle: 'Private residences, civic pavilions, and monolithic structures designed to outlive their moment.',
    items: [
      it('Private Residence', 'A low stone house organized around a sheltered central court.', ['Board-formed', 'Passive cooling', '2026']),
      it('Civic Pavilion', 'A public room held up by a single rhythmic structural frame.', ['Public', 'Timber', 'Open 2025']),
      it('Cultural Wing', 'An extension that defers to the historic building beside it.', ['Adaptive reuse', 'Daylight', 'Exhibition']),
      it('Courtyard House', 'A compact urban home built around light and a single tree.', ['Urban', '9 m frontage', 'Completed'])
    ]
  },
  'real-estate-estate': {
    brandName: 'ESTATE LINE',
    headline: 'Architecturally significant homes, carefully represented',
    subtitle: 'Modernist villas, cliffside houses, and private islands listed with the context they deserve.',
    items: [
      it('Modernist Villa', 'A restored 1960s villa with original details intact.', ['4 beds', 'Restored', 'Coastal']),
      it('Cliffside House', 'A concrete and glass house cantilevered above the water.', ['3 beds', 'Ocean front', 'Private']),
      it('Courtyard Home', 'A walled city house with a garden at its center.', ['City', 'Garden', 'Renovated']),
      it('Island Retreat', 'A fully self-sufficient compound reached only by boat.', ['Private island', 'Off-grid', 'Unique'])
    ]
  },
  'interior-design': {
    brandName: 'MAISON TEXTILE Interior Studio',
    headline: 'Interiors built from textile, timber, and a single good idea',
    subtitle: 'Bespoke residential styling with custom millwork, considered lighting, and materials that age well.',
    items: [
      it('Textile Scheme', 'A layered palette of woven fabrics chosen for touch and longevity.', ['Woven', 'Custom', 'Durable']),
      it('Custom Millwork', 'Cabinetry and joinery drawn for the room it will live in.', ['Bespoke', 'Solid timber', 'Hand-finished']),
      it('Residence Styling', 'A complete furnishing plan assembled over a single season.', ['Full service', 'One season', 'Installed']),
      it('Lighting Plan', 'A layered scheme of ambient, task, and sculptural light.', ['Layered', 'Dimmable', 'Warm'])
    ]
  },
  'landscape-pavilion': {
    brandName: 'TERRA FORM Landscape Practice',
    headline: 'Public landscapes that repair the ground they occupy',
    subtitle: 'Botanical sanctuaries, restored wetlands, and parks designed for people and other species.',
    items: [
      it('Botanical Garden', 'A living collection arranged by habitat rather than taxonomy.', ['Native planting', 'Open access', 'Phased']),
      it('Wetland Restore', 'A former industrial basin returned to marsh and bird habitat.', ['Restoration', 'Monitoring', 'Five years']),
      it('Public Park', 'A shaded civic landscape with room for play and gathering.', ['Public', 'All ages', 'Low water']),
      it('Quiet Courtyard', 'A small, contemplative garden for a cultural institution.', ['Still water', 'Stone', 'Accessible'])
    ]
  },

  // ---------- FINANCE ----------
  'fintech-app': {
    brandName: 'KINETIC Payments',
    headline: 'Move money globally without the usual friction',
    subtitle: 'Cross-border transfers, corporate cards, and treasury yield in a single business account.',
    items: [
      it('Global Transfers', 'Pay suppliers and contractors in their local currency.', ['140 countries', 'Same day', 'Transparent FX']),
      it('Corporate Cards', 'Issued instantly with programmable controls and live receipts.', ['Virtual + physical', 'Controls', 'Accounting sync']),
      it('Treasury Yield', 'Put idle operating cash to work with daily liquidity.', ['No lock-in', 'Daily', 'FDIC network']),
      it('FX Desk', 'Hedge exposure with forward contracts from the same dashboard.', ['Forwards', 'Rate alerts', 'Reported'])
    ]
  },
  'venture-capital': {
    brandName: 'GENESIS SYNDICATE',
    headline: 'Early capital for founders building foundational technology',
    subtitle: 'A syndicate backing technical teams from the first line of code to public liquidity.',
    items: [
      it('Seed Round', 'Lead or co-lead the first institutional round.', ['$1–4 M', 'Board seat', 'Fast close']),
      it('Founder Network', 'A standing group of operators who answer the hard questions.', ['150 founders', 'Monthly', 'Private']),
      it('Growth Fund', 'Follow-on capital for the companies that break out.', ['Reserved', 'Pro-rata', 'Global']),
      it('Founder Liquidity', 'Structured secondary transactions with clean terms.', ['Secondary', 'Flexible', 'Discreet'])
    ]
  },
  'asset-custody': {
    brandName: 'VAULTMARK Custody',
    headline: 'Institutional custody built around provable controls',
    subtitle: 'Hardware-isolated vaults, multi-signatory quorum, and continuous independent audit.',
    items: [
      it('Cold Vault', 'Offline key storage in geographically separate facilities.', ['Air-gapped', 'Dual site', 'Insured']),
      it('Multi-Sig Quorum', 'No single person can move assets, ever.', ['Threshold', 'Role based', 'Hardware keys']),
      it('Audit Trail', 'A continuous, exportable record of every action.', ['Real time', 'Immutable', 'SOC 2']),
      it('Insurance Desk', 'Coverage structured with underwriters who understand digital assets.', ['Coverage', 'Claims support', 'Review'])
    ]
  },
  'neobank': {
    brandName: 'AURELIS Private Bank',
    headline: 'Private banking rebuilt around the way wealth actually lives',
    subtitle: 'Concierge wealth management, digital equities, and family trusts in one considered account.',
    items: [
      it('Wealth Mandate', 'A portfolio built around your actual time horizon.', ['Bespoke', 'Reviewed', 'Global']),
      it('Digital Equities', 'Fractional access to global markets with clear reporting.', ['Fractional', '24/5', 'Low fees']),
      it('Family Trust', 'Structures that carry intentions across generations.', ['Trust setup', 'Governance', 'Privacy']),
      it('Concierge Desk', 'A named team reachable by message, phone, or in person.', ['Named team', '24/7', 'Human'])
    ]
  }
};

const slug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'studio';

const pascal = (value: string): string =>
  slug(value)
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('') || 'Studio';

const sectionFor = (copy: CategoryCopy, key: string): { title: string; subtitle: string } => {
  const raw = copy[key];
  if (raw && typeof raw === 'object') {
    const block = raw as { title?: unknown; subtitle?: unknown };
    return {
      title: typeof block.title === 'string' ? block.title : '',
      subtitle: typeof block.subtitle === 'string' ? block.subtitle : ''
    };
  }
  return { title: '', subtitle: '' };
};

/** Build the full content object from one genre seed + category copy + config. */
function buildContent(genreId: string): ResolvedGenreContent {
  const config = getGenreById(genreId);
  const seed = GENRE_SEEDS[config.id] || GENRE_SEEDS['ceramics-atelier'];
  const copy = CATEGORY_COPY[config.category];
  const sectionKeys: Partial<Record<CategoryId, string>> = {
    commerce: 'products',
    saas: 'pricing',
    portfolio: 'projects',
    publishing: 'articles',
    hospitality: 'booking',
    education: 'courses',
    architecture: 'projects',
    finance: 'stats'
  };
  const section = sectionFor(copy, sectionKeys[config.category] || 'products');
  const features = sectionFor(copy, 'features');
  const hero = copy.hero;
  const brandName = seed.brandName;
  const primaryAction = seed.primaryAction || hero.primaryAction;
  const secondaryAction = seed.secondaryAction || hero.secondaryAction;

  const items: ContentItem[] = seed.items.map((raw, index) => ({
    id: `${config.id}-${slug(raw.title)}`,
    title: raw.title,
    description: raw.description,
    specs: raw.specs && raw.specs.length ? raw.specs : [config.label, config.description],
    image: IMAGES[(index + 1) % IMAGES.length],
    badge: raw.badge,
    price: raw.price,
    originalPrice: undefined,
    rating: 4.8,
    reviewsCount: 120 + index * 37,
    category: 'collection',
    colorways: [
      { name: 'Signature', hex: 'var(--color-brand-500)' },
      { name: 'Neutral', hex: 'var(--color-neutral-400)' }
    ]
  }));

  const highlights: ContentHighlight[] = seed.items.slice(0, 4).map((raw, index) => ({
    id: `${config.id}-pillar-${index}`,
    label: (raw.specs && raw.specs[0]) || raw.title,
    title: raw.title,
    description: raw.description,
    stats: [
      { label: 'Focus', value: (raw.specs && raw.specs[0]) || config.label },
      { label: 'Detail', value: (raw.specs && raw.specs[1]) || `Series 0${index + 1}` },
      { label: 'Standard', value: (raw.specs && raw.specs[2]) || 'Studio verified' }
    ]
  }));

  const outlets = ['EDITORIAL REVIEW', 'DESIGN ANNUAL', 'INDEPENDENT PRESS'];
  const authors = ['Editorial Team', 'Verified Client', 'Industry Reviewer'];
  const quotes: ContentQuote[] = seed.items.slice(0, 3).map((raw, index) => ({
    quote: `“${raw.title}” is the detail people keep coming back to — quietly exceptional from the first impression to the final handoff.`,
    author: authors[index],
    role: brandName,
    outlet: outlets[index]
  }));

  const faqs = [
    {
      q: `What makes ${brandName} different?`,
      a: `${config.description} Every offering is developed with the same attention to material, process, and long-term use.`
    },
    {
      q: `How do I begin with ${brandName}?`,
      a: `Choose ${primaryAction.toLowerCase()} to explore the current collection. Our team will help you find the right fit.`
    },
    {
      q: 'Can I see more detail before committing?',
      a: `Yes — ${secondaryAction.toLowerCase()} gives you the full story, including specifications, materials, and lead times.`
    },
    {
      q: 'What if it is not right for me?',
      a: 'We stand behind every offering with a straightforward review period and direct access to a human who can help.'
    }
  ];

  return {
    genreId: config.id,
    category: config.category,
    label: config.label,
    description: config.description,
    brandName,
    tagline: config.description,
    headline: seed.headline || hero.title,
    subtitle: seed.subtitle || hero.subtitle,
    badge: seed.badge || hero.badge,
    heroImage: config.heroImage,
    primaryAction,
    secondaryAction,
    sectionTitle: seed.sectionTitle || section.title || config.label,
    sectionSubtitle: seed.sectionSubtitle || section.subtitle || config.description,
    featuresTitle: features.title || seed.headline,
    featuresSubtitle: features.subtitle || config.description,
    ctaTitle: seed.ctaTitle || `Join the ${brandName} circle`,
    ctaSubtitle: `Fresh work, studio notes, and early access from ${brandName}. No noise.`,
    items,
    highlights,
    quotes,
    faqs
  };
}

export type ContentOverrides = Partial<
  Pick<ResolvedGenreContent, 'brandName' | 'headline' | 'subtitle' | 'badge' | 'heroImage'>
>;

/**
 * Resolve any genre id (or alias / unknown id) to renderable content.
 * Explicit overrides (e.g. a project's custom name) always win.
 */
export function resolveGenreContent(genreId?: string, overrides?: ContentOverrides): ResolvedGenreContent {
  const base = buildContent(genreId || 'ceramics-atelier');
  if (!overrides) return base;
  const next: ResolvedGenreContent = { ...base };
  if (overrides.brandName) next.brandName = overrides.brandName;
  if (overrides.headline) next.headline = overrides.headline;
  if (overrides.subtitle) next.subtitle = overrides.subtitle;
  if (overrides.badge) next.badge = overrides.badge;
  if (overrides.heroImage) next.heroImage = overrides.heroImage;
  return next;
}

/** Used by templates that need neutral, brand-derived identifiers in code samples. */
export const contentSlug = slug;
export const contentPascal = pascal;
