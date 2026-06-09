import { describe, it, expect, vi } from 'vitest';

// Mock the AI chains
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
        description: 'MIT launches the first commercial computer network connecting major universities.',
        category: 'technology',
        impact: 'high',
        causalityStrength: 0.9,
      },
      {
        year: 1955,
        title: 'Network regulation act passed in Congress',
        description: 'US Congress passes landmark legislation to regulate the computer network industry.',
        category: 'politics',
        impact: 'medium',
        causalityStrength: 0.7,
      },
      {
        year: 1958,
        title: 'First online marketplace opens for trading',
        description: 'NetBazaar launches as the first digital marketplace for goods and services online.',
        category: 'economics',
        impact: 'high',
        causalityStrength: 0.8,
      },
    ],
    decadeSummary: 'The 1950s saw the dawn of the connected age.',
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
      description: 'Pioneer in network infrastructure.',
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
      description: 'The first consumer-grade network terminal for home use.',
      impact: 'revolutionary',
      priceUSD: 2500,
      manufacturer: 'NetCorp Industries',
      specifications: { speed: '56kbps' },
    },
  ]),
}));

// Import after mocks
import { GET, POST } from '@/app/api/v1/timelines/route';
import { GET as GET_TIMELINE, DELETE as DELETE_TIMELINE } from '@/app/api/v1/timelines/[id]/route';
import { createTimeline } from '@/lib/store';

describe('POST /api/v1/timelines', () => {
  it('creates a timeline with valid input', async () => {
    const request = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ divergence: 'Internet invented in 1950' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toMatch(/^tl_/);
    expect(data.status).toBe('generating');
    expect(data.divergence).toBeDefined();
    expect(data.divergence.year).toBe(1950);
    expect(data.streamUrl).toContain(data.id);
  });

  it('rejects input shorter than 10 characters', async () => {
    const request = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ divergence: 'short' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects missing divergence field', async () => {
    const request = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});

describe('GET /api/v1/timelines', () => {
  it('returns a list of timelines', async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.data).toBeDefined();
    expect(Array.isArray(data.data)).toBe(true);
  });
});

describe('GET /api/v1/timelines/:id', () => {
  it('returns a timeline by id', async () => {
    const timeline = createTimeline({
      name: 'Test Timeline',
      divergenceYear: 1950,
      divergencePoint: 'internet',
      description: 'Internet invented in 1950',
    });

    const response = await GET_TIMELINE(
      new Request(`http://localhost/api/v1/timelines/${timeline.id}`),
      { params: Promise.resolve({ id: timeline.id }) }
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.id).toBe(timeline.id);
    expect(data.name).toBe('Test Timeline');
    expect(data.status).toBe('generating');
    expect(data.stats).toBeDefined();
  });

  it('returns 404 for non-existent timeline', async () => {
    const response = await GET_TIMELINE(
      new Request('http://localhost/api/v1/timelines/tl_nonexistent'),
      { params: Promise.resolve({ id: 'tl_nonexistent' }) }
    );

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/v1/timelines/:id', () => {
  it('deletes an existing timeline', async () => {
    const timeline = createTimeline({
      name: 'To Delete',
      divergenceYear: 1980,
      divergencePoint: 'test',
      description: 'Timeline to be deleted',
    });

    const response = await DELETE_TIMELINE(
      new Request(`http://localhost/api/v1/timelines/${timeline.id}`, { method: 'DELETE' }),
      { params: Promise.resolve({ id: timeline.id }) }
    );

    expect(response.status).toBe(204);

    // Verify it's gone
    const getResponse = await GET_TIMELINE(
      new Request(`http://localhost/api/v1/timelines/${timeline.id}`),
      { params: Promise.resolve({ id: timeline.id }) }
    );
    expect(getResponse.status).toBe(404);
  });

  it('returns 404 for non-existent timeline', async () => {
    const response = await DELETE_TIMELINE(
      new Request('http://localhost/api/v1/timelines/tl_gone', { method: 'DELETE' }),
      { params: Promise.resolve({ id: 'tl_gone' }) }
    );

    expect(response.status).toBe(404);
  });
});
