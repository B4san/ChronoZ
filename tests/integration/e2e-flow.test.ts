import { describe, it, expect, vi } from 'vitest';

/**
 * E2E-style integration test for the full timeline creation flow.
 * Tests the complete path: create timeline → stream generation → complete.
 * Uses mocked AI providers but real store and API route logic.
 */

vi.mock('@/lib/ai/chains/divergence-parser', () => ({
  parseDivergence: vi.fn().mockResolvedValue({
    year: 1950,
    subject: 'internet',
    type: 'technology',
    description: 'Internet invented in 1950',
    magnitude: 'world_changing',
  }),
}));

vi.mock('@/lib/ai/chains/timeline-generator', () => ({
  generateDecadeEvents: vi.fn().mockResolvedValue({
    events: [
      {
        year: 1952,
        title: 'First commercial computer network launched',
        description: 'MIT launches the first commercial computer network connecting major universities across the US.',
        category: 'technology',
        impact: 'high',
        causalityStrength: 0.9,
      },
      {
        year: 1956,
        title: 'Network Standards Board established globally',
        description: 'International committee formed to establish standards for the emerging computer network technology.',
        category: 'politics',
        impact: 'medium',
        causalityStrength: 0.6,
      },
      {
        year: 1959,
        title: 'First digital currency proposed by economists',
        description: 'A group of MIT economists proposes a digital currency system for network-based transactions.',
        category: 'economics',
        impact: 'medium',
        causalityStrength: 0.5,
      },
    ],
    decadeSummary: 'The connected age begins with rapid network expansion.',
  }),
}));

vi.mock('@/lib/ai/chains/company-generator', () => ({
  generateCompaniesForDecade: vi.fn().mockResolvedValue([
    {
      name: 'NetCorp Industries',
      foundedYear: 1953,
      industry: 'telecommunications',
      valuation: 500000000,
      headquarters: 'Boston',
      ceo: { name: 'James Wheeler', background: 'MIT engineer' },
      status: 'established',
      description: 'Pioneer in network infrastructure and connectivity solutions.',
      keyProduct: 'NetLink Router',
      employees: 12000,
    },
  ]),
}));

vi.mock('@/lib/ai/chains/product-generator', () => ({
  generateProductsForDecade: vi.fn().mockResolvedValue([
    {
      name: 'NetLink 1000',
      category: 'communication',
      launchYear: 1955,
      description: 'The first consumer-grade network terminal for home connectivity and communication.',
      impact: 'revolutionary',
      priceUSD: 2500,
      manufacturer: 'NetCorp Industries',
      specifications: { speed: '56kbps', weight: '15kg' },
    },
  ]),
}));

import { POST } from '@/app/api/v1/timelines/route';
import { GET as GET_TIMELINE } from '@/app/api/v1/timelines/[id]/route';
import { GET as GET_STREAM } from '@/app/api/v1/timelines/[id]/stream/route';

describe('E2E: Timeline Creation Flow', () => {
  it('completes the full creation → stream → completion cycle', async () => {
    // Step 1: Create timeline
    const createRequest = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ divergence: 'Internet invented in 1950' }),
    });

    const createResponse = await POST(createRequest);
    expect(createResponse.status).toBe(201);

    const createData = await createResponse.json();
    const timelineId = createData.id;
    expect(timelineId).toMatch(/^tl_/);
    expect(createData.divergence.year).toBe(1950);

    // Step 2: Start stream and collect all SSE events
    const streamResponse = await GET_STREAM(
      new Request(`http://localhost/api/v1/timelines/${timelineId}/stream`),
      { params: Promise.resolve({ id: timelineId }) }
    );

    expect(streamResponse.status).toBe(200);
    expect(streamResponse.headers.get('Content-Type')).toBe('text/event-stream');

    // Read the full stream
    const reader = streamResponse.body!.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      fullText += decoder.decode(value, { stream: true });
    }

    // Verify SSE events were emitted
    expect(fullText).toContain('event: phase');
    expect(fullText).toContain('event: parsed');
    expect(fullText).toContain('event: events');
    expect(fullText).toContain('event: companies');
    expect(fullText).toContain('event: products');
    expect(fullText).toContain('event: complete');

    // Step 3: Verify timeline is now complete
    const getResponse = await GET_TIMELINE(
      new Request(`http://localhost/api/v1/timelines/${timelineId}`),
      { params: Promise.resolve({ id: timelineId }) }
    );

    const timeline = await getResponse.json();
    expect(timeline.status).toBe('completed');
    expect(timeline.consistencyScore).toBeGreaterThan(0);
    expect(timeline.events.length).toBeGreaterThan(0);
    expect(timeline.companies.length).toBeGreaterThan(0);
    expect(timeline.products.length).toBeGreaterThan(0);
  });

  it('returns 404 for streaming non-existent timeline', async () => {
    const streamResponse = await GET_STREAM(
      new Request('http://localhost/api/v1/timelines/tl_fake/stream'),
      { params: Promise.resolve({ id: 'tl_fake' }) }
    );

    expect(streamResponse.status).toBe(404);
  });
});
