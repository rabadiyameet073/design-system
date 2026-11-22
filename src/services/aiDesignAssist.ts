import { GoogleGenAI } from '@google/genai';
import { DesignTokens } from '../tokens/types';
import { createDefaultTokens } from '../tokens/defaultTokens';

export interface BrandPrompt {
  brandName: string;
  industry: string;
  vibe: string;
  keywords?: string[];
}

export interface GeneratedBrandTokens {
  projectName: string;
  primaryColor: string;
  headingFamily: string;
  bodyFamily: string;
  vibeDescription: string;
  suggestedCopy: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
}

export interface MarketingCopyResult {
  headline: string;
  subheadline: string;
  ctaText: string;
  bulletPoints?: string[];
}

export interface PaletteSuggestion {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  description: string;
}

/**
 * Gets Gemini API Key from environment or Vite env if available
 */
function getGeminiApiKey(): string {
  try {
    if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
      return process.env.GEMINI_API_KEY;
    }
  } catch {
    // ignore
  }
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) {
      return (import.meta as any).env.VITE_GEMINI_API_KEY;
    }
  } catch {
    // ignore
  }
  return '';
}

/**
 * Deterministic offline brand presets based on industry and vibe
 */
const INDUSTRY_PRESETS: Record<
  string,
  {
    primary: string;
    heading: string;
    body: string;
    headline: string;
    subheadline: string;
    cta: string;
  }
> = {
  fintech: {
    primary: '#0284C7',
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
    headline: 'Intelligent financial systems built for institutional scale',
    subheadline: 'Real-time liquidity, automated settlement, and cryptographic trust.',
    cta: 'Explore Platform'
  },
  luxury: {
    primary: '#B45309',
    heading: 'Fraunces',
    body: 'DM Sans',
    headline: 'The quiet luxury of timeless craftsmanship',
    subheadline: 'Artisanal attention to detail for discerning connoisseurs worldwide.',
    cta: 'Discover Collection'
  },
  saas: {
    primary: '#6366F1',
    heading: 'Outfit',
    body: 'Inter',
    headline: 'Accelerate your engineering velocity by 10x',
    subheadline: 'The unified workspace that turns complex roadmaps into high-impact products.',
    cta: 'Start Free Trial'
  },
  health: {
    primary: '#0D9488',
    heading: 'Outfit',
    body: 'Plus Jakarta Sans',
    headline: 'Precision wellness powered by clinical biomarkers',
    subheadline: 'Personalized longevity and preventive medicine for your optimal life.',
    cta: 'Begin Assessment'
  },
  creative: {
    primary: '#D946EF',
    heading: 'Syne',
    body: 'Space Grotesk',
    headline: 'Where visionary ideas become tactile digital reality',
    subheadline: 'Expressive aesthetics, cinematic motion, and spatial experiences.',
    cta: 'View Showcase'
  },
  ecommerce: {
    primary: '#EA580C',
    heading: 'Playfair Display',
    body: 'DM Sans',
    headline: 'Thoughtfully curated goods for your everyday ritual',
    subheadline: 'Sustainable materials, ethical production, and seamless doorstep delivery.',
    cta: 'Shop Now'
  }
};

/**
 * 1. AI Brand-to-Tokens Assistant
 * Synthesizes cohesive brand identity, colors, and typography from a user brief.
 */
export async function generateBrandTokens(
  prompt: BrandPrompt
): Promise<GeneratedBrandTokens> {
  const apiKey = getGeminiApiKey();

  // If Gemini API Key is available, attempt generative model
  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const systemInstruction = `You are an elite Design Director. Given a brand brief (Name, Industry, Vibe), return a JSON object with:
- "projectName": string
- "primaryColor": hex color string (#RRGGBB) matching the vibe and having good accessibility potential
- "headingFamily": one of ["Fraunces", "Plus Jakarta Sans", "Outfit", "Space Grotesk", "Playfair Display", "Syne", "Cinzel", "DM Sans", "Inter"]
- "bodyFamily": one of ["Inter", "DM Sans", "Plus Jakarta Sans", "Roboto", "Space Grotesk"]
- "vibeDescription": concise 1-sentence design critique
- "suggestedCopy": { "headline": string, "subheadline": string, "ctaText": string }
Return raw JSON only, no markdown fencing.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Brand Name: ${prompt.brandName}\nIndustry: ${prompt.industry}\nVibe: ${prompt.vibe}\nKeywords: ${(prompt.keywords || []).join(', ')}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        projectName: parsed.projectName || prompt.brandName,
        primaryColor: parsed.primaryColor || '#6366F1',
        headingFamily: parsed.headingFamily || 'Plus Jakarta Sans',
        bodyFamily: parsed.bodyFamily || 'Inter',
        vibeDescription: parsed.vibeDescription || `Tailored aesthetic for ${prompt.brandName}.`,
        suggestedCopy: {
          headline: parsed.suggestedCopy?.headline || `Welcome to ${prompt.brandName}`,
          subheadline: parsed.suggestedCopy?.subheadline || `Premium solutions for ${prompt.industry}.`,
          ctaText: parsed.suggestedCopy?.ctaText || 'Get Started'
        }
      };
    } catch (err) {
      console.warn('Gemini API call failed, falling back to deterministic heuristic design engine:', err);
    }
  }

  // Deterministic Fallback Engine
  const industryKey = Object.keys(INDUSTRY_PRESETS).find(k =>
    prompt.industry.toLowerCase().includes(k)
  ) || 'saas';
  const preset = INDUSTRY_PRESETS[industryKey];

  return {
    projectName: prompt.brandName || 'Modern Brand',
    primaryColor: preset.primary,
    headingFamily: preset.heading,
    bodyFamily: preset.body,
    vibeDescription: `A ${prompt.vibe.toLowerCase()} aesthetic tailored for ${prompt.industry}.`,
    suggestedCopy: {
      headline: preset.headline,
      subheadline: preset.subheadline,
      ctaText: preset.cta
    }
  };
}

/**
 * 2. AI Marketing Copy Synthesizer
 */
export async function generateMarketingCopy(prompt: {
  brandName: string;
  offering: string;
  tone: string;
}): Promise<MarketingCopyResult> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Brand: ${prompt.brandName}\nOffering: ${prompt.offering}\nTone: ${prompt.tone}`,
        config: {
          systemInstruction:
            'You are an award-winning copywriter. Return a JSON object with: headline (max 8 words), subheadline (max 20 words), and ctaText (max 3 words). Return raw JSON only.',
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      return {
        headline: parsed.headline,
        subheadline: parsed.subheadline,
        ctaText: parsed.ctaText
      };
    } catch (err) {
      console.warn('Gemini copy generation failed, using fallback copy:', err);
    }
  }

  return {
    headline: `${prompt.brandName} — Built for Purpose`,
    subheadline: prompt.offering || 'Empowering modern teams to deliver exceptional digital experiences.',
    ctaText: 'Get Started'
  };
}

/**
 * 3. AI Natural Language Palette Extractor
 */
export async function generatePaletteFromDescription(
  description: string
): Promise<PaletteSuggestion> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Description: "${description}"`,
        config: {
          systemInstruction:
            'Generate a cohesive 4-color palette inspired by this natural language description. Return raw JSON: { "name": string, "primary": "#hex", "secondary": "#hex", "accent": "#hex", "neutral": "#hex", "description": string }',
          responseMimeType: 'application/json'
        }
      });

      const text = response.text || '';
      const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleanJson);
    } catch (err) {
      console.warn('Gemini palette extraction failed, using heuristic extraction:', err);
    }
  }

  // Heuristic rule matches
  const lower = description.toLowerCase();
  if (lower.includes('matcha') || lower.includes('forest') || lower.includes('green')) {
    return {
      name: 'Organic Matcha',
      primary: '#2D6A4F',
      secondary: '#52B788',
      accent: '#D8F3DC',
      neutral: '#F7FBF9',
      description: 'Earthy organic green palette inspired by fresh Japanese matcha.'
    };
  }

  if (lower.includes('sunset') || lower.includes('terracotta') || lower.includes('warm')) {
    return {
      name: 'Desert Terracotta',
      primary: '#C85A32',
      secondary: '#E09F3E',
      accent: '#F3C68F',
      neutral: '#FAF6F0',
      description: 'Warm glowing desert terracotta with amber sunset highlights.'
    };
  }

  if (lower.includes('ocean') || lower.includes('marine') || lower.includes('blue')) {
    return {
      name: 'Deep Oceanic',
      primary: '#0A4D68',
      secondary: '#088395',
      accent: '#05BFDB',
      neutral: '#F0F8FF',
      description: 'Cool abyssal azure tones with glowing turquoise accents.'
    };
  }

  if (lower.includes('cyber') || lower.includes('neon') || lower.includes('dark')) {
    return {
      name: 'Cyberpunk Neon',
      primary: '#8B5CF6',
      secondary: '#EC4899',
      accent: '#06B6D4',
      neutral: '#0F172A',
      description: 'Electric violet and neon magenta designed for high-contrast dark modes.'
    };
  }

  return {
    name: 'Modern Studio Indigo',
    primary: '#4F46E5',
    secondary: '#818CF8',
    accent: '#C7D2FE',
    neutral: '#F8FAFC',
    description: 'Clean balanced indigo palette suited for enterprise and SaaS products.'
  };
}
