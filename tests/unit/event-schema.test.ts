import { describe, it, expect } from 'vitest';
import { GeneratedEventSchema, DecadeEventsSchema } from '@/schemas/event';

describe('GeneratedEventSchema', () => {
  it('validates a correct event', () => {
    const result = GeneratedEventSchema.safeParse({
      year: 1955,
      title: 'MIT launches the first commercial network',
      description: 'The Massachusetts Institute of Technology launches the first commercial computer network, marking the beginning of the connected age.',
      category: 'technology',
      impact: 'high',
      causalityStrength: 0.85,
    });
    expect(result.success).toBe(true);
  });

  it('rejects title too short', () => {
    const result = GeneratedEventSchema.safeParse({
      year: 1955,
      title: 'Short',
      description: 'This is a valid description that is long enough to pass validation.',
      category: 'technology',
      impact: 'high',
      causalityStrength: 0.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = GeneratedEventSchema.safeParse({
      year: 1955,
      title: 'This is a valid title that is long enough',
      description: 'This is a valid description that is long enough to pass validation.',
      category: 'sports',
      impact: 'high',
      causalityStrength: 0.5,
    });
    expect(result.success).toBe(false);
  });

  it('rejects causalityStrength out of range', () => {
    const result = GeneratedEventSchema.safeParse({
      year: 1955,
      title: 'This is a valid title that is long enough',
      description: 'This is a valid description that is long enough to pass validation.',
      category: 'technology',
      impact: 'high',
      causalityStrength: 1.5,
    });
    expect(result.success).toBe(false);
  });
});

describe('DecadeEventsSchema', () => {
  it('validates a correct decade result', () => {
    const result = DecadeEventsSchema.safeParse({
      events: [
        {
          year: 1952,
          title: 'First event of the decade',
          description: 'This is the first event description that is long enough to pass.',
          category: 'technology',
          impact: 'medium',
          causalityStrength: 0.7,
        },
        {
          year: 1955,
          title: 'Second event of the decade',
          description: 'This is the second event description that is long enough to pass.',
          category: 'economics',
          impact: 'high',
          causalityStrength: 0.9,
        },
        {
          year: 1958,
          title: 'Third event of the decade',
          description: 'This is the third event description that is long enough to pass.',
          category: 'science',
          impact: 'low',
          causalityStrength: 0.3,
        },
      ],
      decadeSummary: 'The 1950s saw the beginning of the connected age.',
    });
    expect(result.success).toBe(true);
  });

  it('rejects with fewer than 3 events', () => {
    const result = DecadeEventsSchema.safeParse({
      events: [
        {
          year: 1952,
          title: 'First event of the decade',
          description: 'This is the first event description that is long enough to pass.',
          category: 'technology',
          impact: 'medium',
          causalityStrength: 0.7,
        },
      ],
      decadeSummary: 'A short summary.',
    });
    expect(result.success).toBe(false);
  });
});
