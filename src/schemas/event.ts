import { z } from 'zod';

export const GeneratedEventSchema = z.object({
  year: z.number().int(),
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(500),
  category: z.enum(['technology', 'politics', 'economics', 'culture', 'science', 'military']),
  impact: z.enum(['low', 'medium', 'high', 'critical']),
  causalityStrength: z.number().min(0).max(1)
    .describe('How directly caused by the divergence point (0=independent, 1=direct)'),
});

export type GeneratedEvent = z.infer<typeof GeneratedEventSchema>;

export const DecadeEventsSchema = z.object({
  events: z.array(GeneratedEventSchema).min(3).max(8)
    .describe('Events for this decade, ordered chronologically'),
  decadeSummary: z.string().max(200).describe('One-paragraph summary of the decade'),
});

export type DecadeEvents = z.infer<typeof DecadeEventsSchema>;
