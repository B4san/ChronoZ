import { describe, it, expect } from 'vitest';
import { GeneratedProductSchema } from '@/schemas/product';

describe('GeneratedProductSchema', () => {
  it('validates a correct product', () => {
    const result = GeneratedProductSchema.safeParse({
      name: 'MindLink 88',
      category: 'communication',
      launchYear: 1988,
      description: 'First neural communication device for consumers.',
      impact: 'revolutionary',
      priceUSD: 2499,
      manufacturer: 'Neural Electric Corp',
      specifications: {
        weight: '200g',
        battery: '24 hours',
        connectivity: 'Quantum Net',
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    const result = GeneratedProductSchema.safeParse({
      name: 'Test Product',
      category: 'computing',
      launchYear: 1990,
      description: 'A test product.',
      impact: 'minor',
      priceUSD: -50,
      manufacturer: 'Test Corp',
      specifications: {},
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid category', () => {
    const result = GeneratedProductSchema.safeParse({
      name: 'Test Product',
      category: 'food',
      launchYear: 1990,
      description: 'A test product.',
      impact: 'minor',
      priceUSD: 100,
      manufacturer: 'Test Corp',
      specifications: {},
    });
    expect(result.success).toBe(false);
  });
});
