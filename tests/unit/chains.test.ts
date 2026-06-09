import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DivergenceInputSchema } from '@/schemas/divergence';
import { DecadeEventsSchema } from '@/schemas/event';
import { GeneratedCompanySchema } from '@/schemas/company';
import { GeneratedProductSchema } from '@/schemas/product';

// Mock the ai module
vi.mock('ai', () => ({
  generateObject: vi.fn(),
}));

// Mock the provider to avoid needing OPENROUTER_API_KEY
vi.mock('@/lib/ai/provider', () => ({
  models: {
    timeline: 'mock-timeline-model',
    entity: 'mock-entity-model',
    parser: 'mock-parser-model',
    fallback: 'mock-fallback-model',
  },
}));

import { generateObject } from 'ai';

const mockGenerateObject = vi.mocked(generateObject);

describe('Divergence Parser Chain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('parses a divergence input into structured data', async () => {
    const mockResult = {
      year: 1950,
      subject: 'internet',
      type: 'technology',
      description: 'Internet invented in 1950',
      magnitude: 'world_changing',
    };

    mockGenerateObject.mockResolvedValueOnce({
      object: mockResult,
      finishReason: 'stop',
      usage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      rawResponse: undefined,
      warnings: [],
      request: {},
      response: {},
      logprobs: undefined,
      toJsonResponse: () => new Response(),
    } as never);

    const { parseDivergence } = await import('@/lib/ai/chains/divergence-parser');
    const result = await parseDivergence('Internet invented in 1950');

    expect(result).toEqual(mockResult);
    expect(mockGenerateObject).toHaveBeenCalledOnce();
    expect(DivergenceInputSchema.safeParse(result).success).toBe(true);
  });
});

describe('Timeline Generator Chain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates decade events with valid schema', async () => {
    const mockDecadeEvents = {
      events: [
        {
          year: 1952,
          title: 'First commercial computer network launched by MIT',
          description: 'The Massachusetts Institute of Technology launches the first commercial network connecting universities across the Eastern United States.',
          category: 'technology',
          impact: 'high',
          causalityStrength: 0.9,
        },
        {
          year: 1955,
          title: 'Global Communications Act passed by US Congress',
          description: 'The United States Congress passes landmark legislation regulating the burgeoning computer network industry and establishing standards.',
          category: 'politics',
          impact: 'medium',
          causalityStrength: 0.7,
        },
        {
          year: 1958,
          title: 'First online marketplace opens for digital goods',
          description: 'NetBazaar launches as the first marketplace for buying and selling digital goods over the network, revolutionizing commerce.',
          category: 'economics',
          impact: 'high',
          causalityStrength: 0.8,
        },
      ],
      decadeSummary: 'The 1950s saw rapid network expansion and early digital commerce.',
    };

    mockGenerateObject.mockResolvedValueOnce({
      object: mockDecadeEvents,
      finishReason: 'stop',
      usage: { promptTokens: 100, completionTokens: 200, totalTokens: 300 },
      rawResponse: undefined,
      warnings: [],
      request: {},
      response: {},
      logprobs: undefined,
      toJsonResponse: () => new Response(),
    } as never);

    const { generateDecadeEvents } = await import('@/lib/ai/chains/timeline-generator');
    const result = await generateDecadeEvents(1950, {
      year: 1950,
      subject: 'internet',
      type: 'technology',
      description: 'Internet invented in 1950',
      magnitude: 'world_changing',
    });

    expect(result.events).toHaveLength(3);
    expect(DecadeEventsSchema.safeParse(result).success).toBe(true);
    expect(mockGenerateObject).toHaveBeenCalledOnce();
  });
});

describe('Company Generator Chain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates companies with valid schema', async () => {
    const mockCompanies = [
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
      {
        name: 'DataStream Labs',
        foundedYear: 1957,
        industry: 'software',
        valuation: 250000000,
        headquarters: 'San Francisco',
        ceo: { name: 'Maria Chen', background: 'Stanford CS professor' },
        status: 'growing',
        description: 'Developer of early network protocols and data transfer software.',
        keyProduct: 'StreamOS',
        employees: 3500,
      },
    ];

    mockGenerateObject.mockResolvedValueOnce({
      object: mockCompanies,
      finishReason: 'stop',
      usage: { promptTokens: 100, completionTokens: 200, totalTokens: 300 },
      rawResponse: undefined,
      warnings: [],
      request: {},
      response: {},
      logprobs: undefined,
      toJsonResponse: () => new Response(),
    } as never);

    const { generateCompaniesForDecade } = await import('@/lib/ai/chains/company-generator');
    const result = await generateCompaniesForDecade(1950, {
      year: 1950,
      subject: 'internet',
      type: 'technology',
      description: 'Internet invented in 1950',
      magnitude: 'world_changing',
    }, []);

    expect(result).toHaveLength(2);
    result.forEach((company) => {
      expect(GeneratedCompanySchema.safeParse(company).success).toBe(true);
    });
  });
});

describe('Product Generator Chain', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('generates products with valid schema', async () => {
    const mockProducts = [
      {
        name: 'NetLink 1000',
        category: 'communication',
        launchYear: 1955,
        description: 'The first consumer-grade network terminal allowing home connections to the global network.',
        impact: 'revolutionary',
        priceUSD: 2500,
        manufacturer: 'NetCorp Industries',
        specifications: { speed: '56kbps', weight: '15kg', display: 'CRT 9 inch' },
      },
      {
        name: 'DataPad Pro',
        category: 'computing',
        launchYear: 1958,
        description: 'Portable computing device with built-in network connectivity for professionals.',
        impact: 'significant',
        priceUSD: 4200,
        manufacturer: 'DataStream Labs',
        specifications: { memory: '64KB', storage: '1MB', battery: '4 hours' },
      },
    ];

    mockGenerateObject.mockResolvedValueOnce({
      object: mockProducts,
      finishReason: 'stop',
      usage: { promptTokens: 100, completionTokens: 200, totalTokens: 300 },
      rawResponse: undefined,
      warnings: [],
      request: {},
      response: {},
      logprobs: undefined,
      toJsonResponse: () => new Response(),
    } as never);

    const { generateProductsForDecade } = await import('@/lib/ai/chains/product-generator');
    const result = await generateProductsForDecade(1950, {
      year: 1950,
      subject: 'internet',
      type: 'technology',
      description: 'Internet invented in 1950',
      magnitude: 'world_changing',
    }, [], ['NetCorp Industries']);

    expect(result).toHaveLength(2);
    result.forEach((product) => {
      expect(GeneratedProductSchema.safeParse(product).success).toBe(true);
    });
  });
});
