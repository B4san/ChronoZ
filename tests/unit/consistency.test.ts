import { describe, it, expect } from 'vitest';
import { validateTimeline } from '@/lib/consistency';
import type { Timeline } from '@/types';

function makeTimeline(overrides: Partial<Timeline> = {}): Timeline {
  return {
    id: 'tl_test',
    name: 'Test Timeline',
    divergenceYear: 1950,
    divergencePoint: 'internet',
    description: 'Internet invented in 1950',
    status: 'completed',
    consistencyScore: 0,
    createdBy: 'test',
    createdAt: new Date(),
    updatedAt: new Date(),
    events: [],
    companies: [],
    products: [],
    ...overrides,
  };
}

describe('Consistency Validator', () => {
  it('returns perfect score for empty timeline', () => {
    const result = validateTimeline(makeTimeline());
    expect(result.score).toBe(1);
    expect(result.issues).toHaveLength(0);
  });

  it('passes when all events are after divergence', () => {
    const result = validateTimeline(makeTimeline({
      events: [
        { id: 'ev_1', timelineId: 'tl_test', year: 1955, title: 'Event One title here', description: 'desc', category: 'technology', impact: 'high', causalityStrength: 0.8 },
        { id: 'ev_2', timelineId: 'tl_test', year: 1960, title: 'Event Two title here', description: 'desc', category: 'politics', impact: 'medium', causalityStrength: 0.5 },
      ],
    }));
    expect(result.issues.filter((i) => i.type === 'temporal')).toHaveLength(0);
  });

  it('detects events before divergence year', () => {
    const result = validateTimeline(makeTimeline({
      events: [
        { id: 'ev_1', timelineId: 'tl_test', year: 1940, title: 'Before divergence event', description: 'desc', category: 'technology', impact: 'high', causalityStrength: 0.8 },
      ],
    }));
    expect(result.issues).toHaveLength(1);
    expect(result.issues[0].type).toBe('temporal');
    expect(result.issues[0].severity).toBe('error');
  });

  it('detects companies founded before divergence', () => {
    const result = validateTimeline(makeTimeline({
      companies: [
        { id: 'co_1', timelineId: 'tl_test', name: 'OldCorp', foundedYear: 1945, industry: 'tech', valuation: 1000000, headquarters: 'NYC', status: 'established', description: 'old', keyProduct: 'thing', employees: 100, ceo: { name: 'A', background: 'B' } },
      ],
    }));
    expect(result.issues.some((i) => i.type === 'temporal' && i.message.includes('OldCorp'))).toBe(true);
  });

  it('detects products referencing unknown manufacturers', () => {
    const result = validateTimeline(makeTimeline({
      companies: [
        { id: 'co_1', timelineId: 'tl_test', name: 'KnownCorp', foundedYear: 1955, industry: 'tech', valuation: 1000000, headquarters: 'NYC', status: 'established', description: 'known', keyProduct: 'thing', employees: 100, ceo: { name: 'A', background: 'B' } },
      ],
      products: [
        { id: 'pr_1', timelineId: 'tl_test', name: 'Widget X', category: 'computing', launchYear: 1960, description: 'desc', impact: 'significant', priceUSD: 500, manufacturer: 'UnknownCorp', specifications: {} },
      ],
    }));
    expect(result.issues.some((i) => i.type === 'referential')).toBe(true);
  });

  it('passes when product manufacturer exists in companies', () => {
    const result = validateTimeline(makeTimeline({
      companies: [
        { id: 'co_1', timelineId: 'tl_test', name: 'NetCorp', foundedYear: 1955, industry: 'tech', valuation: 1000000, headquarters: 'NYC', status: 'established', description: 'corp', keyProduct: 'thing', employees: 100, ceo: { name: 'A', background: 'B' } },
      ],
      products: [
        { id: 'pr_1', timelineId: 'tl_test', name: 'Widget', category: 'computing', launchYear: 1960, description: 'desc', impact: 'significant', priceUSD: 500, manufacturer: 'NetCorp', specifications: {} },
      ],
    }));
    const refIssues = result.issues.filter((i) => i.type === 'referential');
    expect(refIssues).toHaveLength(0);
  });

  it('calculates score correctly', () => {
    const result = validateTimeline(makeTimeline({
      events: [
        { id: 'ev_1', timelineId: 'tl_test', year: 1955, title: 'Valid event title here okay', description: 'desc', category: 'technology', impact: 'high', causalityStrength: 0.8 },
        { id: 'ev_2', timelineId: 'tl_test', year: 1940, title: 'Invalid event before time', description: 'desc', category: 'politics', impact: 'medium', causalityStrength: 0.5 },
      ],
    }));
    // 2 temporal checks: 1 pass, 1 fail. Plus 1 duplicate check = pass
    expect(result.score).toBeGreaterThan(0);
    expect(result.score).toBeLessThan(1);
  });
});
