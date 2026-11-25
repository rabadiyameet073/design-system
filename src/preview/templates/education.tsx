import React, { useState } from 'react';
import { TemplateProps } from './index';
import {
  ComponentsShowcase,
  TypeSpecimen,
  GenreOfferings
} from '../sections';
import {
  GraduationCap,
  Calendar,
  Users,
  Award,
  BookOpen,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Bookmark,
  Check,
  Star,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building,
  Atom,
  Cpu,
  Brain,
  DollarSign,
  Scale,
  Microscope,
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';

interface AcademicMentor {
  name: string;
  degree: string;
  institution: string;
  department: string;
  avatar: string;
  specialties: string[];
  bio: string;
}

const PHD_MENTORS: AcademicMentor[] = [
  {
    name: 'Dr. Julian Thorne',
    degree: 'Ph.D. in Stem Cell & Regenerative Biology',
    institution: 'Harvard University',
    department: 'Department of Molecular and Cellular Biology',
    avatar: '/src/assets/images/hero_founder_studio_1792316645323.jpg',
    specialties: ['CRISPR-Cas9', 'Cancer Genomics', 'Synthetic Biology'],
    bio: 'Lead postdoctoral fellow investigating targeted epigenetic therapeutics. Mentored 14 fellows now studying at Harvard, Yale, and Stanford.'
  },
  {
    name: 'Dr. Elena Rostova',
    degree: 'Ph.D. in Computer Science & Artificial Intelligence',
    institution: 'Stanford University',
    department: 'Stanford AI Laboratory (SAIL)',
    avatar: '/src/assets/images/preview_saas_metrics_1792316645998.jpg',
    specialties: ['Physics-Informed Neural Networks', 'Diffusion Models', 'Autonomous Systems'],
    bio: 'Research scientist publishing in NeurIPS, ICML, and CVPR. Specializes in guiding high school scholars through novel algorithmic publications.'
  },
  {
    name: 'Dr. Marcus Vance',
    degree: 'Ph.D. in Economics & Public Policy',
    institution: 'University of Oxford',
    department: 'Department of Economics & Nuffield College',
    avatar: '/src/assets/images/preview_editorial_arch_1792316647413.jpg',
    specialties: ['Behavioral Economics', 'Algorithmic Game Theory', 'Development Policy'],
    bio: 'Former consultant to the World Bank and IMF. Guides students in rigorous empirical econometric modeling and international journal submissions.'
  },
  {
    name: 'Dr. Anya Patel',
    degree: 'Ph.D. in Physics & Quantum Information',
    institution: 'University of Cambridge',
    department: 'Cavendish Laboratory',
    avatar: '/src/assets/images/preview_ecommerce_ceramics_1792316645917.jpg',
    specialties: ['Quantum Computing', 'Acoustic Metamaterials', 'Superconductivity'],
    bio: 'Fellow at Trinity College researching topological wave systems. Multiple mentees recognized as Regeneron STS and ISEF finalists.'
  }
];

const RESEARCH_DISCIPLINES = [
  {
    id: 'ai-cs',
    name: 'Computer Science & AI',
    icon: Cpu,
    tagline: 'Deep learning, neural architectures, computer vision, and robotics.',
    sampleTopics: [
      'Zero-Shot Reasoning in Medical Diagnostic LLMs',
      'Physics-Informed Neural Networks for Fluid Dynamics',
      'Adversarial Robustness in Autonomous Navigation Systems'
    ],
    studentAdmit: 'Accepted to MIT, Stanford & Carnegie Mellon'
  },
  {
    id: 'medicine',
    name: 'Biomedicine & Neuroscience',
    icon: Microscope,
    tagline: 'Genomics, immunology, neurodegenerative disease, and oncology.',
    sampleTopics: [
      'CRISPR Off-Target Cleavage in Glioblastoma Cell Lines',
      'Microbiome Dysbiosis and Neuroinflammation Biomarkers',
      'Targeted Nanoparticle Drug Delivery for Solid Tumors'
    ],
    studentAdmit: 'Accepted to Harvard, Johns Hopkins & Yale'
  },
  {
    id: 'economics',
    name: 'Economics & Behavioral Finance',
    icon: DollarSign,
    tagline: 'Econometrics, algorithmic game theory, macro policy, and behavioral markets.',
    sampleTopics: [
      'Liquidity Volatility in Decentralized Automated Market Makers',
      'Behavioral Nudges in Low-Income Microfinance Repayment',
      'Carbon Tax Border Adjustments on Global Supply Chains'
    ],
    studentAdmit: 'Accepted to Oxford, Princeton & LSE'
  },
  {
    id: 'physics',
    name: 'Physics & Clean Energy',
    icon: Atom,
    tagline: 'Quantum mechanics, functional metamaterials, and solar energy materials.',
    sampleTopics: [
      'Broadband Low-Frequency Acoustic Absorption via Metasurfaces',
      'Perovskite Crystal Stability in Tandem Photovoltaics',
      'Quantum Error Mitigation on Superconducting Qubit Processors'
    ],
    studentAdmit: 'Accepted to Caltech, Cambridge & Columbia'
  },
  {
    id: 'law-policy',
    name: 'Law, Ethics & International Relations',
    icon: Scale,
    tagline: 'Constitutional law, bioethics, diplomacy, and global governance.',
    sampleTopics: [
      'Autonomous Weapons Systems under International Humanitarian Law',
      'Algorithmic Copyright & Fair Use in Generative Training Data',
      'Transnational Water Security Treaties in the Indus Basin'
    ],
    studentAdmit: 'Accepted to Georgetown, Yale & Chicago'
  }
];

const STUDENT_PUBLICATIONS = [
  {
    title: 'Predictive Inverse Modeling of Broadband Metamaterial Absorbers Using Physics-Informed Neural Networks',
    student: 'Aarav M. (Class of 2025)',
    mentor: 'Mentored by Dr. Anya Patel (PhD Cambridge)',
    journal: 'Journal of Applied Physics & Emerging Technology',
    doi: '10.1063/5.0189421',
    admitBadge: 'Admitted to Stanford University'
  },
  {
    title: 'CRISPR-Cas9 Off-Target Cleavage Kinetics in Pediatric Glioblastoma Therapy',
    student: 'Sophia C. (Class of 2025)',
    mentor: 'Mentored by Dr. Julian Thorne (PhD Harvard)',
    journal: 'International Journal of High School Medical Research',
    doi: '10.1145/3642189.med',
    admitBadge: 'Admitted to Harvard University'
  },
  {
    title: 'Algorithmic Market Fragility in Automated Liquidity Pools Under Asymmetric Information',
    student: 'Ethan L. (Class of 2025)',
    mentor: 'Mentored by Dr. Marcus Vance (PhD Oxford)',
    journal: 'Cambridge Review of International Economics',
    doi: '10.1080/09638199.2025',
    admitBadge: 'Admitted to MIT'
  }
];

const PROGRAM_TIERS = [
  {
    name: 'Individual Research Scholar Track',
    duration: '12 Weeks',
    intensity: '4â€“6 Hours / Week',
    featured: false,
    badge: 'Foundation Program',
    description: 'Work 1-on-1 with a PhD researcher to master academic literature, develop an original thesis, and produce a publication-length research paper.',
    features: [
      '9 Individual 1-on-1 Mentorship Sessions with PhD Scholar',
      'Comprehensive 15-Page Collegiate Research Paper',
      'Formal Academic Evaluation & Letter of Recommendation',
      'Access to JSTOR, IEEE & University Library Repositories',
      'Weekly Writing Specialist Office Hours'
    ],
    cta: 'Apply for Individual Track'
  },
  {
    name: 'Premium Publication & Symposium Track',
    duration: '16 Weeks',
    intensity: '5â€“7 Hours / Week',
    featured: true,
    badge: 'Most Popular for Ivy Applicants',
    description: 'Everything in the Individual Program plus dedicated journal publication management, symposium defense prep, and competition coaching.',
    features: [
      '14 Individual 1-on-1 Mentorship Sessions with PhD Scholar',
      'Dedicated Journal Publication Advisor & Copyeditor',
      'Targeted Submission to Indexed Peer-Reviewed Journals',
      'Oral Defense & Research Poster Preparation Training',
      'Guidance for Regeneron ISEF, STS & National Science Fairs',
      'Executive Letter of Recommendation for College Admissions'
    ],
    cta: 'Apply for Publication Track'
  },
  {
    name: 'Foundational Research Fellowship',
    duration: '24 Weeks',
    intensity: '6â€“8 Hours / Week',
    featured: false,
    badge: 'Advanced Interdisciplinary',
    description: 'For scholars aiming to complete multi-phase research or dual-discipline investigations (e.g. AI + Medicine or Economics + Data Science).',
    features: [
      '20 Individual 1-on-1 Mentorship Sessions',
      'Dual PhD Mentors across Two Complementary Disciplines',
      'Comprehensive Multi-Part Manuscript (25+ Pages)',
      'Multiple Journal & Preprint Submissions (arXiv / BioRxiv)',
      'Mentorship for International Academic Conferences',
      'Priority Financial Aid & Merit Grant Consideration'
    ],
    cta: 'Apply for Fellowship Track'
  }
];

const ADMISSIONS_FAQS = [
  {
    q: 'What academic qualifications are required to apply?',
    a: 'We evaluate applicants holistically. There is no strict minimum GPA or test score requirement. We look for deep intellectual curiosity, demonstrated passion in an academic discipline, and the commitment to work independently under rigorous doctoral guidance.'
  },
  {
    q: 'How does the 1-on-1 PhD mentor matching process work?',
    a: 'Upon admission, our Academic Advisory Committee reviews your specific research interests, preferred field, and learning style. We match you with a PhD researcher or postdoctoral fellow from top institutions (Harvard, Oxford, Stanford, MIT, Cambridge) whose exact doctoral work aligns with your goals.'
  },
  {
    q: 'Can international students and high school freshmen/sophomores apply?',
    a: 'Yes. Our research scholars join us from over 45 countries worldwide. We accept driven students in grades 9 through 12, as well as early undergraduate students seeking independent research publications.'
  },
  {
    q: 'How does the publication process work, and is publication guaranteed?',
    a: 'In the Publication Track, you are paired with a dedicated Publication Specialist who guides you through journal selection, formatting, peer-review feedback, and revision. While ultimate editorial acceptance depends on journal review boards, 100% of our Publication Track students submit completed manuscripts to indexed academic journals.'
  },
  {
    q: 'Are financial aid and need-based scholarships available?',
    a: 'Yes. We are deeply committed to ensuring that financial limitations never prevent exceptional minds from conducting research. We provide need-based grants covering up to 100% of program tuition for qualifying students.'
  }
];

export const EducationTemplate: React.FC<TemplateProps> = ({
  content,
  brandName: brandNameProp,
  headline: headlineProp,
  subtitle: subtitleProp,
  badge: badgeProp,
  heroImage,
  genreId,
  components,
  buttonStyle
}) => {
  const brandName = content?.brandName || brandNameProp || 'AURELIA Research Scholar Institute';
  const headline = headlineProp || content?.headline;
  const subtitle = subtitleProp || content?.subtitle;
  const badge = content?.badge || badgeProp || 'Founded by Researchers from Harvard & Oxford';
  const [activeDisciplineIndex, setActiveDisciplineIndex] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedDoi, setCopiedDoi] = useState<string | null>(null);

  const enabled = components?.enabledComponents;
  const isSectionEnabled = (section: string) => {
    if (section === 'hero' || section === 'announcement' || section === 'components' || section === 'type') {
      return true;
    }
    if (!enabled || enabled.length === 0) return true;

    const moduleMapping: Record<string, string[]> = {
      partners: ['metrics-row', 'partners', 'stats', 'trust'],
      methodology: ['product-card', 'features', 'curriculum', 'methodology'],
      disciplines: ['product-card', 'courses', 'programs', 'disciplines'],
      programs: ['pricing-matrix', 'programs', 'pricing', 'fellowships'],
      mentors: ['product-card', 'mentors', 'faculty-directory', 'features'],
      publications: ['product-card', 'publications', 'research', 'articles'],
      testimonials: ['reviews-grid', 'testimonials', 'reviews', 'student-proof'],
      faq: ['curriculum-accordion', 'faq', 'accordion'],
      cta: ['newsletter', 'cta', 'leadCapture', 'admissions']
    };

    const aliases = moduleMapping[section];
    if (!aliases) return true;
    return aliases.some(alias => enabled.includes(alias));
  };
  const isEnabled = isSectionEnabled;

  const effectiveBtnStyle = buttonStyle || (components as any)?.buttonStyle || 'solid';

  const getPrimaryBtnStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-button, var(--radius-md, 8px))',
      fontFamily: 'var(--font-ui, var(--font-body, sans-serif))',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    };
    if (effectiveBtnStyle === 'outline') {
      return { ...base, backgroundColor: 'transparent', color: 'var(--color-action-primary)', border: '2px solid var(--color-action-primary)' };
    }
    if (effectiveBtnStyle === 'subtle') {
      return { ...base, backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-action-primary)', border: '1px solid var(--color-border-default)' };
    }
    if (effectiveBtnStyle === 'minimal') {
      return { ...base, backgroundColor: 'transparent', color: 'var(--color-action-primary)', border: 'none', boxShadow: 'none' };
    }
    return { ...base, backgroundColor: 'var(--color-action-primary)', color: 'var(--color-action-primary-fg)', border: 'none' };
  };

  const cardVariant = (components as any)?.cardStyle || 'bordered';
  const getCardStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      borderRadius: 'var(--radius-card, var(--radius-lg, 16px))',
      backgroundColor: 'var(--color-bg-surface)',
      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
    };
    if (cardVariant === 'elevated') {
      return { ...base, border: '1px solid var(--color-border-default)', boxShadow: 'var(--shadow-md, 0 10px 15px -3px rgba(0,0,0,0.1))' };
    }
    if (cardVariant === 'flat-tint') {
      return { ...base, border: 'none', boxShadow: 'none' };
    }
    return { ...base, border: '1px solid var(--color-border-default)', boxShadow: 'none' };
  };

  const getImageStyle = (): React.CSSProperties => ({
    filter: 'var(--image-filter, none)',
    borderRadius: 'var(--radius-card, var(--radius-lg, 16px))',
    transition: 'filter 0.2s ease'
  });

  const handleCopyDoi = (doi: string) => {
    setCopiedDoi(doi);
    navigator.clipboard.writeText(doi);
    setTimeout(() => setCopiedDoi(null), 2500);
  };

  const universityPartners = [
    'Harvard University',
    'Stanford University',
    'MIT',
    'University of Oxford',
    'University of Cambridge',
    'Yale University',
    'Princeton University',
    'Columbia University',
    'Caltech'
  ];

  return (
    <div className="w-full min-h-screen flex flex-col bg-[var(--color-bg-default)] text-[var(--color-fg-default)] selection:bg-[var(--color-action-primary)] selection:text-[var(--color-action-primary-fg)] font-sans antialiased">
      {/* 1. Admissions Alert Top Banner */}
      {isSectionEnabled('announcement') && (
        <aside aria-label="Announcement" className="w-full py-2.5 px-4 bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] text-xs text-center font-medium tracking-wide flex items-center justify-center gap-3">
          <GraduationCap className="w-3.5 h-3.5 opacity-90" />
          <span className="font-bold">Applications Now Open:</span>
          <span>Fall 2026 Research Fellowship Cohort Â· Limited to 150 Fellows Worldwide</span>
          <span className="hidden sm:inline">Â· Priority Financial Aid Deadline Approaching</span>
        </aside>
      )}

      {/* 2. Prestigious Academic Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--color-bg-default)]/95 border-b border-[var(--color-border-default)] transition-colors">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-18 flex items-center justify-between gap-6">
          {/* Logo & Crest */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] flex items-center justify-center font-serif font-black text-base shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span
                className="text-base sm:text-lg font-black tracking-tight text-[var(--color-fg-default)] block leading-none"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {brandName}
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[var(--color-fg-muted)] uppercase">
                Academic Research Fellowship
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold tracking-wide text-[var(--color-fg-muted)]">
            <a href="#how-it-works" className="hover:text-[var(--color-fg-default)] transition-colors">How It Works</a>
            <a href="#disciplines" className="hover:text-[var(--color-fg-default)] transition-colors">Research Fields</a>
            <a href="#programs" className="hover:text-[var(--color-fg-default)] transition-colors">Programs & Tiers</a>
            <a href="#mentors" className="hover:text-[var(--color-fg-default)] transition-colors">PhD Mentors</a>
            <a href="#publications" className="hover:text-[var(--color-fg-default)] transition-colors">Publications & Admits</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)] transition-colors">Admissions FAQ</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <a
              href="#admissions"
              className="px-5 py-2.5 text-xs font-bold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 cursor-pointer flex items-center gap-2"
              style={getPrimaryBtnStyle()}
            >
              <span>Apply for Fellowship</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 3. Grand Academic Hero Section Inspired by Lumiere Education */}
        {isSectionEnabled('hero') && (
        <section className="relative w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)] overflow-hidden">
          <div className="max-w-6xl mx-auto space-y-10 text-center">
            {/* Kicker Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] text-[var(--color-action-primary)] shadow-sm mx-auto">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>

            {/* Main Headline */}
            <h1
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[var(--color-fg-default)] max-w-4xl mx-auto leading-[1.08]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {headline || 'Conduct 1-on-1 Academic Research with World-Class PhD Mentors.'}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[var(--color-fg-muted)] max-w-2xl mx-auto leading-relaxed">
              {subtitle ||
                'Work individually alongside doctoral scholars and fellows from Harvard, Oxford, Stanford, and MIT. Author an original, publication-ready research paper and stand out in the worldâ€™s most selective university admissions.'}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#programs"
                className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-95 cursor-pointer flex items-center gap-2"
                style={getPrimaryBtnStyle()}
              >
                <span>Explore Research Tracks</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#admissions"
                className="px-6 py-4 text-xs sm:text-sm font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:bg-[var(--color-bg-default)] text-[var(--color-fg-default)] transition-colors flex items-center gap-2"
                style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
              >
                <Calendar className="w-4 h-4 text-[var(--color-action-primary)]" />
                <span>Book Admissions Consultation</span>
              </a>
            </div>

            {/* High-Impact Proof Stats Row */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--color-fg-default)] font-mono block">
                  5,400+
                </span>
                <p className="text-xs text-[var(--color-fg-muted)] font-medium">Scholars Mentored Worldwide</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--color-fg-default)] font-mono block">
                  1,950+
                </span>
                <p className="text-xs text-[var(--color-fg-muted)] font-medium">Original Papers Authored</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--color-status-success)] font-mono block">
                  94.6%
                </span>
                <p className="text-xs text-[var(--color-fg-muted)] font-medium">Top-30 University Acceptance</p>
              </div>

              <div className="p-4 rounded-2xl bg-[var(--color-bg-surface)] border border-[var(--color-border-default)] space-y-1">
                <span className="text-2xl sm:text-4xl font-black text-[var(--color-action-primary)] font-mono block">
                  1 : 1
                </span>
                <p className="text-xs text-[var(--color-fg-muted)] font-medium">Dedicated PhD Mentor Ratio</p>
              </div>
            </div>
          </div>
        </section>
        )}

        {/* 4. University Acceptance Logos Bar */}
        {isSectionEnabled('partners') && (
        <section className="w-full py-8 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <p className="text-[11px] font-mono uppercase tracking-widest text-[var(--color-fg-muted)] font-semibold">
              Our Fellows Have Been Admitted to the World's Leading Universities
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-80">
              {universityPartners.map((uni, idx) => (
                <span
                  key={idx}
                  className="font-serif font-black text-sm sm:text-base text-[var(--color-fg-default)] tracking-wider uppercase hover:text-[var(--color-action-primary)] transition-colors"
                >
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 5. The 4-Step Mentorship Model ("How the Fellowship Works") */}
        {isSectionEnabled('methodology') && (
        <section id="how-it-works" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12 text-left">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                The Research Methodology
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                From Curiosity to Published Scholarship
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                A structured, collegiate-level research pipeline designed to take you from initial spark to a defensible, peer-reviewed manuscript.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Precision 1-on-1 Matching',
                  desc: 'Paired individually with a doctoral scholar from Harvard, Oxford, Stanford, or Cambridge in your exact passion.'
                },
                {
                  step: '02',
                  title: 'Topic & Literature Review',
                  desc: 'Survey current peer-reviewed publications to uncover open research questions and formulate an original thesis.'
                },
                {
                  step: '03',
                  title: 'Rigorous Manuscript Drafting',
                  desc: 'Conduct computational, empirical, or theoretical analysis and author a comprehensive 15-20 page collegiate paper.'
                },
                {
                  step: '04',
                  title: 'Journal Publication & Defense',
                  desc: 'Work with our publication editors to submit to indexed journals and prepare oral presentations for competitions.'
                }
              ].map(st => (
                <div
                  key={st.step}
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4 hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] flex items-center justify-center font-mono font-black text-sm text-[var(--color-action-primary)]">
                    {st.step}
                  </div>
                  <h3 className="text-base font-bold text-[var(--color-fg-default)] leading-snug">
                    {st.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 6. Interactive Disciplines & Research Fields */}
        {isSectionEnabled('disciplines') && (
        <section id="disciplines" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Academic Disciplines
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Explore High-Impact Research Fields
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                Click any discipline below to view sample fellow research papers, doctoral specialties, and college placement outcomes.
              </p>
            </div>

            {/* Discipline Selector Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {RESEARCH_DISCIPLINES.map((disc, idx) => {
                const Icon = disc.icon;
                const isActive = activeDisciplineIndex === idx;
                return (
                  <button
                    key={disc.id}
                    onClick={() => setActiveDisciplineIndex(idx)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)] border-[var(--color-action-primary)] shadow-sm'
                        : 'bg-[var(--color-bg-default)] border-[var(--color-border-default)] text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{disc.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Discipline Card */}
            {(() => {
              const current = RESEARCH_DISCIPLINES[activeDisciplineIndex];
              return (
                <div className="p-8 sm:p-12 rounded-3xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
                  <div className="lg:col-span-7 space-y-5">
                    <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                      Featured Field Â· {current.name}
                    </span>
                    <h3
                      className="text-2xl sm:text-3xl font-black text-[var(--color-fg-default)] leading-snug"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {current.tagline}
                    </h3>

                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                        Sample Fellow Research Questions:
                      </h4>
                      <ul className="space-y-2">
                        {current.sampleTopics.map((top, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--color-fg-default)]">
                            <CheckCircle className="w-4 h-4 text-[var(--color-status-success)] shrink-0 mt-0.5" />
                            <span className="font-medium italic">"{top}"</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-[var(--color-border-default)] flex items-center gap-2 text-xs font-bold text-emerald-600">
                      <Award className="w-4 h-4" />
                      <span>{current.studentAdmit}</span>
                    </div>
                  </div>

                  {/* Discipline Spotlight Box */}
                  <div className="lg:col-span-5 p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-4">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--color-fg-muted)]">
                      Mentorship Deliverables
                    </h4>
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] flex items-center justify-between">
                        <span>Expected Manuscript Length</span>
                        <strong className="font-mono">15â€“20 Pages</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] flex items-center justify-between">
                        <span>Journal Target Level</span>
                        <strong className="font-mono text-[var(--color-action-primary)]">Indexed & Peer-Reviewed</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-[var(--color-bg-default)] border border-[var(--color-border-default)] flex items-center justify-between">
                        <span>Recommendation Letter</span>
                        <strong className="font-mono text-[var(--color-status-success)]">Provided by PhD Scholar</strong>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </section>
        )}

        {/* 7. Fellowship Program Tiers & Comparison Cards */}
        {isSectionEnabled('programs') && (
        <section id="programs" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Admissions Tracks
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Choose Your Research Program
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                All programs include personalized 1-on-1 mentorship with a vetted doctoral researcher, academic writing review, and library access.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left items-stretch">
              {PROGRAM_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className={`rounded-3xl border p-8 flex flex-col justify-between transition-all duration-300 relative ${
                    tier.featured
                      ? 'border-[var(--color-action-primary)] bg-[var(--color-bg-default)] shadow-2xl ring-2 ring-[var(--color-action-primary)]/20 lg:-translate-y-2'
                      : 'border-[var(--color-border-default)] bg-[var(--color-bg-surface)] hover:shadow-lg'
                  }`}
                >
                  {tier.badge && (
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider mb-4 self-start ${
                        tier.featured
                          ? 'bg-[var(--color-action-primary)] text-[var(--color-action-primary-fg)]'
                          : 'bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-[var(--color-fg-muted)]'
                      }`}
                    >
                      {tier.badge}
                    </span>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--color-fg-default)] leading-snug">
                      {tier.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-mono text-[var(--color-fg-muted)]">
                      <span className="flex items-center gap-1 font-bold text-[var(--color-action-primary)]">
                        <Clock className="w-3.5 h-3.5" />
                        {tier.duration}
                      </span>
                      <span>Â·</span>
                      <span>{tier.intensity}</span>
                    </div>
                    <p className="text-xs text-[var(--color-fg-muted)] leading-relaxed">
                      {tier.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="space-y-2.5 pt-4 border-t border-[var(--color-border-default)]">
                      {tier.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-fg-default)]">
                          <Check className="w-4 h-4 text-[var(--color-status-success)] shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <a
                      href="#admissions"
                      className={`w-full py-3 text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        tier.featured
                          ? 'shadow-[var(--shadow-md)] hover:opacity-95'
                          : 'border border-[var(--color-border-default)] bg-[var(--color-bg-default)] hover:bg-[var(--color-bg-surface)] text-[var(--color-fg-default)]'
                      }`}
                      style={
                        tier.featured
                          ? getPrimaryBtnStyle()
                          : { borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }
                      }
                    >
                      <span>{tier.cta}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 8. World-Class PhD Mentor Spotlight Showcase */}
        {isSectionEnabled('mentors') && (
        <section id="mentors" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Doctoral Faculty
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Mentorship by Vetted PhD Scholars
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] leading-relaxed">
                Our mentors are active researchers and doctoral candidates from the worldâ€™s foremost academic institutions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {PHD_MENTORS.map((mentor, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] p-6 space-y-4 hover:shadow-xl transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-full object-cover border border-[var(--color-border-default)]"
                        style={getImageStyle()}
                      />
                      <div>
                        <h3 className="text-sm font-bold text-[var(--color-fg-default)]">{mentor.name}</h3>
                        <p className="text-[11px] font-semibold text-[var(--color-action-primary)]">{mentor.institution}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-[var(--color-fg-muted)] font-mono leading-tight">
                      {mentor.degree}
                    </p>

                    <p className="text-xs text-[var(--color-fg-default)] leading-relaxed italic">
                      "{mentor.bio}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-default)] space-y-1">
                    <span className="text-[10px] font-mono uppercase text-[var(--color-fg-muted)]">Specialties:</span>
                    <div className="flex flex-wrap gap-1">
                      {mentor.specialties.map((sp, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-[var(--color-bg-surface)] text-[var(--color-fg-muted)] border border-[var(--color-border-default)]"
                        >
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Research Group Opportunities Callout */}
            <div
              className="mt-12 p-8 border border-[var(--color-border-default)] bg-[var(--color-bg-default)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-[var(--shadow-md)]"
              style={getCardStyle()}
            >
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[var(--color-bg-surface)] text-[var(--color-action-primary)] border border-[var(--color-border-default)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Research Lab & Academic Group Opportunities</span>
                </div>
                <h3
                  className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--color-fg-default)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  We welcome motivated students to join our research group as interns, Master’s students, and PhD researchers.
                </h3>
                <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-2xl">
                  Collaborate directly with our principal investigators and PhD scholars on peer-reviewed investigations, computational modeling, and international conference publications.
                </p>
              </div>

              <a
                href="#admissions"
                className="px-6 py-3 text-xs font-bold tracking-wide transition-all shadow-[var(--shadow-sm)] hover:opacity-90 shrink-0 cursor-pointer flex items-center gap-2"
                style={getPrimaryBtnStyle()}
              >
                <span>Inquire for Lab Openings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
        )}

        {/* 9. Published Student Research & Ivy League Admissions Outcomes */}
        {isSectionEnabled('publications') && (
        <section id="publications" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-4xl mx-auto space-y-10 text-left">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Student Research Archive
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Published Papers & University Outcomes
              </h2>
              <p className="text-xs sm:text-sm text-[var(--color-fg-muted)]">
                Examine real peer-reviewed papers produced by our high school and collegiate fellows under 1-on-1 doctoral guidance.
              </p>
            </div>

            <div className="space-y-4">
              {STUDENT_PUBLICATIONS.map((pub, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] space-y-3 hover:shadow-md transition-all"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      {pub.admitBadge}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyDoi(pub.doi)}
                      className="text-xs font-mono text-[var(--color-fg-muted)] hover:text-[var(--color-fg-default)] flex items-center gap-1 cursor-pointer"
                    >
                      <span>DOI: {pub.doi}</span>
                      {copiedDoi === pub.doi ? (
                        <Check className="w-3.5 h-3.5 text-[var(--color-status-success)]" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[var(--color-fg-default)] leading-snug">
                    {pub.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-fg-muted)] pt-1">
                    <span className="font-semibold text-[var(--color-fg-default)]">{pub.student}</span>
                    <span>Â·</span>
                    <span>{pub.mentor}</span>
                    <span>Â·</span>
                    <span className="font-mono text-[var(--color-action-primary)]">{pub.journal}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 10. Student & Parent Testimonials */}
        {isSectionEnabled('testimonials') && (
        <section className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Fellow Testimonials
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Transforming College Admissions
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  quote:
                    'Working 1-on-1 with my Harvard mentor was the defining intellectual experience of my high school years. Writing a real 18-page manuscript and having it published gave my Stanford application a level of academic depth that ordinary grades could never match.',
                  author: 'Aarav Patel',
                  role: 'Stanford University â€˜29 (Admitted Early Action)',
                  stars: 5
                },
                {
                  quote:
                    'As a parent, I was blown away by the seriousness of the doctoral mentorship. My daughter wasnâ€™t just given reading assignments; she was taught how to code simulations in Python and formulate novel hypotheses. She is now thriving at MIT.',
                  author: 'Dr. Michael Chen',
                  role: 'Parent of MIT â€˜29 Fellow',
                  stars: 5
                },
                {
                  quote:
                    'The publication advisor walked me step-by-step through peer-review revisions. Defending my research during college interviews gave me tremendous confidence. I was accepted to Oxford and Cambridge.',
                  author: 'Claire V.',
                  role: 'University of Cambridge â€˜29 Scholar',
                  stars: 5
                }
              ].map((test, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-default)] shadow-sm space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(test.stars)].map((_, s) => (
                        <Star key={s} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-[var(--color-fg-default)] leading-relaxed italic">
                      "{test.quote}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[var(--color-border-default)]">
                    <h4 className="text-xs font-bold text-[var(--color-fg-default)]">{test.author}</h4>
                    <p className="text-[11px] text-[var(--color-fg-muted)]">{test.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        )}

        {/* 11. Admissions FAQ Accordion */}
        {isSectionEnabled('faq') && (
        <section id="faq" className="w-full py-16 sm:py-24 px-6 sm:px-12 border-b border-[var(--color-border-default)]">
          <div className="max-w-3xl mx-auto space-y-8 text-left">
            <div className="text-center space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-[var(--color-action-primary)] uppercase">
                Admissions Information
              </span>
              <h2
                className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--color-fg-default)]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {ADMISSIONS_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-[var(--color-border-default)] bg-[var(--color-bg-surface)] overflow-hidden transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-5 flex items-center justify-between text-left gap-4 cursor-pointer hover:bg-[var(--color-bg-default)]/50 transition-colors"
                    >
                      <span className="text-xs sm:text-sm font-bold text-[var(--color-fg-default)]">
                        {faq.q}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-[var(--color-action-primary)] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[var(--color-fg-muted)] shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-[var(--color-fg-muted)] leading-relaxed border-t border-[var(--color-border-default)] pt-3">
                        <p>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        )}

        {/* 12. Final High-Impact Admissions Application Banner */}
        {isSectionEnabled('cta') && (
        <section id="admissions" className="w-full py-16 sm:py-24 px-6 sm:px-12 bg-[var(--color-bg-surface)] border-b border-[var(--color-border-default)]">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--color-bg-default)] border border-[var(--color-border-default)] text-[var(--color-action-primary)]">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Fall 2026 Admissions Open</span>
            </div>

            <h2
              className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--color-fg-default)] leading-tight"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Begin Your Journey into Academic Research
            </h2>

            <p className="text-xs sm:text-sm text-[var(--color-fg-muted)] max-w-xl mx-auto leading-relaxed">
              Applications are reviewed on a rolling basis. Due to the individual nature of 1-on-1 PhD researcher matching, each cohort is strictly capped at 150 fellows worldwide.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#admissions"
                className="px-8 py-4 text-xs sm:text-sm font-bold tracking-wide uppercase transition-all shadow-[var(--shadow-md)] hover:opacity-90 cursor-pointer flex items-center gap-2"
                style={getPrimaryBtnStyle()}
              >
                <span>Submit Fellowship Application</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#how-it-works"
                className="px-6 py-4 text-xs sm:text-sm font-semibold tracking-wide border border-[var(--color-border-default)] bg-[var(--color-bg-default)] hover:bg-[var(--color-bg-surface)] text-[var(--color-fg-default)] transition-colors"
                style={{ borderRadius: 'var(--radius-button, var(--radius-md, 8px))' }}
              >
                <span>Download Fellowship Prospectus (.PDF)</span>
              </a>
            </div>
          </div>
        </section>
        )}
        {/* 13. Design System Showcase & Type Specimen (Doc 02 §4.3) */}
        <GenreOfferings content={content} />
        {(isEnabled('components') || isEnabled('componentsShowcase')) && <ComponentsShowcase />}
        <TypeSpecimen />
      </main>

      {/* 13. Academic Collegiate Footer */}
      <footer className="w-full py-12 px-6 sm:px-12 bg-[var(--color-bg-default)] border-t border-[var(--color-border-default)] text-xs text-[var(--color-fg-muted)]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-left">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-serif font-black text-sm uppercase tracking-wider text-[var(--color-fg-default)]">
              <BookOpen className="w-4 h-4 text-[var(--color-action-primary)]" />
              <span>{brandName}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Founded by doctoral researchers from Harvard and Oxford. Dedicated to empowering high school and undergraduate scholars through rigorous 1-on-1 academic mentorship.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Programs</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#programs" className="hover:text-[var(--color-fg-default)]">Individual Scholar Track (12 Wks)</a></li>
              <li><a href="#programs" className="hover:text-[var(--color-fg-default)]">Publication & Symposium Track (16 Wks)</a></li>
              <li><a href="#programs" className="hover:text-[var(--color-fg-default)]">Foundational Fellowship (24 Wks)</a></li>
              <li><a href="#admissions" className="hover:text-[var(--color-fg-default)]">Need-Based Financial Aid</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Research Fields</h4>
            <ul className="space-y-1 text-[11px]">
              <li><a href="#disciplines" className="hover:text-[var(--color-fg-default)]">Computer Science & AI</a></li>
              <li><a href="#disciplines" className="hover:text-[var(--color-fg-default)]">Biomedicine & Genetics</a></li>
              <li><a href="#disciplines" className="hover:text-[var(--color-fg-default)]">Economics & Public Policy</a></li>
              <li><a href="#disciplines" className="hover:text-[var(--color-fg-default)]">Physics & Clean Energy</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-[var(--color-fg-default)] font-mono uppercase text-[10px]">Accreditation & Ethics</h4>
            <p className="text-[11px] leading-relaxed">
              All manuscripts adhere to the Committee on Publication Ethics (COPE) standards. Mentors vetted across top global research universities.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-[var(--color-border-default)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>Â© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Academic Honor Code</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Privacy Policy</a>
            <a href="#faq" className="hover:text-[var(--color-fg-default)]">Terms of Admissions</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EducationTemplate;


