import { z } from 'zod';

export const GeneratedCompanySchema = z.object({
  name: z.string().describe('Realistic company name for the era and industry'),
  foundedYear: z.number().int(),
  industry: z.string(),
  valuation: z.number().min(0).describe('Company valuation in USD'),
  headquarters: z.string().describe('City name'),
  ceo: z.object({
    name: z.string().describe('Full name'),
    background: z.string().max(100),
  }),
  status: z.enum(['startup', 'growing', 'established', 'acquired', 'defunct', 'ipo']),
  description: z.string().max(300),
  keyProduct: z.string().describe('Main product or service'),
  employees: z.number().int().min(0),
});

export type GeneratedCompany = z.infer<typeof GeneratedCompanySchema>;
