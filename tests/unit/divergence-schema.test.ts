import { describe, it, expect } from 'vitest';
import { DivergenceInputSchema } from '@/schemas/divergence';

describe('DivergenceInputSchema', () => {
  it('validates a correct divergence', () => {
    const result = DivergenceInputSchema.safeParse({
      year: 1950,
      subject: 'internet',
      type: 'technology',
      description: 'What if the internet was invented in 1950?',
      magnitude: 'major',
    });
    expect(result.success).toBe(true);
  });

  it('rejects year before 0', () => {
    const result = DivergenceInputSchema.safeParse({
      year: -100,
      subject: 'fire',
      type: 'technology',
      description: 'Fire discovered early',
      magnitude: 'minor',
    });
    expect(result.success).toBe(false);
  });

  it('rejects year after 2100', () => {
    const result = DivergenceInputSchema.safeParse({
      year: 2200,
      subject: 'flying cars',
      type: 'technology',
      description: 'Flying cars invented',
      magnitude: 'major',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid type', () => {
    const result = DivergenceInputSchema.safeParse({
      year: 1950,
      subject: 'internet',
      type: 'invalid_type',
      description: 'test',
      magnitude: 'major',
    });
    expect(result.success).toBe(false);
  });

  it('accepts all valid event types', () => {
    const types = ['technology', 'politics', 'economics', 'science', 'military', 'culture'];
    for (const type of types) {
      const result = DivergenceInputSchema.safeParse({
        year: 2000,
        subject: 'test',
        type,
        description: 'test description',
        magnitude: 'moderate',
      });
      expect(result.success).toBe(true);
    }
  });
});
