import { describe, it, expect } from 'vitest';
import { GeneratedCompanySchema } from '@/schemas/company';

describe('GeneratedCompanySchema', () => {
  it('validates a correct company', () => {
    const result = GeneratedCompanySchema.safeParse({
      name: 'Neural Electric Corp',
      foundedYear: 1963,
      industry: 'telecommunications',
      valuation: 3200000000000,
      headquarters: 'New London',
      ceo: {
        name: 'Margaret Hughes',
        background: 'Former MIT professor turned entrepreneur',
      },
      status: 'ipo',
      description: 'Pioneer in neural communication devices.',
      keyProduct: 'MindLink',
      employees: 15000000,
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative valuation', () => {
    const result = GeneratedCompanySchema.safeParse({
      name: 'Test Corp',
      foundedYear: 1963,
      industry: 'tech',
      valuation: -100,
      headquarters: 'City',
      ceo: { name: 'John Doe', background: 'Engineer' },
      status: 'startup',
      description: 'A test company.',
      keyProduct: 'Product',
      employees: 100,
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid status', () => {
    const result = GeneratedCompanySchema.safeParse({
      name: 'Test Corp',
      foundedYear: 1963,
      industry: 'tech',
      valuation: 1000000,
      headquarters: 'City',
      ceo: { name: 'John Doe', background: 'Engineer' },
      status: 'public',
      description: 'A test company.',
      keyProduct: 'Product',
      employees: 100,
    });
    expect(result.success).toBe(false);
  });
});
