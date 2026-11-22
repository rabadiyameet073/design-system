import { z } from 'zod';

export const designTokensSchema = z.object({
  schemaVersion: z.number().optional().default(1),
  meta: z.object({
    projectName: z.string().optional(),
    slug: z.string().optional(),
    genreId: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    goal: z.string().optional(),
    audience: z.string().optional(),
    audienceAge: z.string().optional(),
    platformTarget: z.string().optional(),
    frameworkTarget: z.string().optional(),
    darkMode: z.string().optional(),
    scripts: z.array(z.string()).optional(),
    inspirationUrls: z.array(z.string()).optional(),
    personality: z.record(z.string(), z.number()).optional(),
    createdAt: z.number().optional(),
    updatedAt: z.number().optional()
  }).passthrough().optional().default({}),
  color: z.record(z.string(), z.any()).optional().default({}),
  typography: z.record(z.string(), z.any()).optional().default({}),
  space: z.record(z.string(), z.any()).optional().default({}),
  radius: z.record(z.string(), z.any()).optional().default({}),
  shadow: z.record(z.string(), z.any()).optional().default({}),
  motion: z.record(z.string(), z.any()).optional().default({}),
  component: z.record(z.string(), z.any()).optional().default({})
}).passthrough();

export const designProjectSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  schemaVersion: z.number().optional().default(1),
  name: z.string().min(1, 'Project name is required'),
  createdAt: z.number().optional().default(() => Date.now()),
  updatedAt: z.number().optional().default(() => Date.now()),
  currentStep: z.number().optional().default(1),
  completedSteps: z.array(z.number()).optional().default([1]),
  tokens: designTokensSchema,
  websiteType: z.record(z.string(), z.any()).optional().default({}),
  business: z.record(z.string(), z.any()).optional().default({}),
  brandPersonality: z.record(z.string(), z.any()).optional().default({}),
  visualDirection: z.record(z.string(), z.any()).optional().default({}),
  colorPalette: z.record(z.string(), z.any()).optional().default({}),
  typography: z.record(z.string(), z.any()).optional().default({}),
  layout: z.record(z.string(), z.any()).optional().default({}),
  components: z.record(z.string(), z.any()).optional().default({}),
  imagery: z.record(z.string(), z.any()).optional().default({}),
  responsive: z.record(z.string(), z.any()).optional().default({}),
  accessibility: z.record(z.string(), z.any()).optional().default({})
}).passthrough();

export function validateProjectData(data: unknown) {
  return designProjectSchema.safeParse(data);
}

export function validateTokensData(data: unknown) {
  return designTokensSchema.safeParse(data);
}
