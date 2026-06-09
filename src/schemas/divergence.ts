import { z } from 'zod';

export const DivergenceInputSchema = z.object({
  year: z.number().int().min(0).max(2100).describe('Year of divergence'),
  subject: z.string().describe('What changed (e.g., "internet", "nuclear energy")'),
  type: z.enum([
    'technology', 'politics', 'economics', 'science',
    'military', 'culture',
  ]),
  description: z.string().describe('Original user description'),
  magnitude: z.enum(['minor', 'moderate', 'major', 'world_changing'])
    .describe('How big is this change'),
});

export type DivergenceInput = z.infer<typeof DivergenceInputSchema>;
