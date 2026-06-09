import { z } from 'zod';

export const GeneratedProductSchema = z.object({
  name: z.string().describe('Catchy, era-appropriate product name'),
  category: z.enum(['communication', 'computing', 'transportation', 'medicine', 'entertainment', 'energy']),
  launchYear: z.number().int(),
  description: z.string().max(300),
  impact: z.enum(['minor', 'moderate', 'significant', 'revolutionary']),
  priceUSD: z.number().min(0),
  manufacturer: z.string().describe('Company name that makes this'),
  specifications: z.record(z.string(), z.string())
    .describe('Key specs as key-value pairs'),
});

export type GeneratedProduct = z.infer<typeof GeneratedProductSchema>;
