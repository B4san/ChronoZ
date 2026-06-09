# Chronos Engine — AI & LLM Integration Strategy

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Architecture Overview

```
User Input
    │
    ▼
┌─────────────────────┐
│   LLM Gateway       │
│   (Vercel AI SDK)   │
│                     │
│  ┌───────────────┐  │
│  │ Rate Limiter  │  │
│  │ (ai-sdk-rate- │  │
│  │  limiter)     │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────┴───────┐  │
│  │  Cache Layer  │  │
│  │  (Redis)      │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────┴───────┐  │
│  │  Provider     │  │
│  │  Router       │  │
│  │  ┌─────────┐  │  │
│  │  │ OpenAI  │  │  │
│  │  │ Claude  │  │  │
│  │  │ Gemin   │  │  │
│  │  └─────────┘  │  │
│  └───────────────┘  │
└─────────────────────┘
    │
    ▼
Structured Output (Zod validated)
```

---

## 2. Provider Strategy

### 2.1 Provider Selection by Task

| Task | Provider | Model | Justificación |
|---|---|---|---|
| **Timeline generation** | Anthropic | Claude Sonnet 4 | Excelente en reasoning de cadenas causales, structured output |
| **Entity generation** | OpenAI | GPT-4o | Rápido, buen structured output, costo razonable |
| **News articles** | OpenAI | GPT-4o | Creativo, buen formato de texto |
| **Wikipedia articles** | Anthropic | Claude Sonnet 4 | Consistencia y largo de generación |
| **Consistency validation** | OpenAI | GPT-4o-mini | Tarea simple, modelo barato |
| **Divergence parsing** | OpenAI | GPT-4o-mini | Clasificación simple |
| **Map/country generation** | Anthropic | Claude Sonnet 4 | Razonamiento geográfico complejo |
| **Fallback** | OpenAI | GPT-4o-mini | Cuando los primarios fallan |

### 2.2 Provider Abstraction

```typescript
// src/lib/ai/provider.ts
import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const models = {
  // Primary models
  timeline: anthropic('claude-sonnet-4-6'),
  entity: openai('gpt-4o'),
  news: openai('gpt-4o'),
  wiki: anthropic('claude-sonnet-4-6'),
  map: anthropic('claude-sonnet-4-6'),
  
  // Light models
  parser: openai('gpt-4o-mini'),
  validator: openai('gpt-4o-mini'),
  
  // Fallback
  fallback: openai('gpt-4o-mini'),
} as const;
```

---

## 3. Structured Output Schemas

### 3.1 Divergence Parsing

```typescript
// src/schemas/divergence.ts
import { z } from 'zod';

export const DivergenceInputSchema = z.object({
  year: z.number().int().min(0).max(2100).describe("Year of divergence"),
  subject: z.string().describe("What changed (e.g., 'internet', 'nuclear energy')"),
  type: z.enum([
    'technology', 'politics', 'economics', 'science', 
    'military', 'culture', 'demographics', 'natural_disaster'
  ]),
  description: z.string().describe("Original user description"),
  magnitude: z.enum(['minor', 'moderate', 'major', 'world_changing'])
    .describe("How big is this change"),
});

export type DivergenceInput = z.infer<typeof DivergenceInputSchema>;
```

### 3.2 Event Generation

```typescript
// src/schemas/event.ts
export const GeneratedEventSchema = z.object({
  year: z.number().int(),
  title: z.string().min(10).max(100),
  description: z.string().min(50).max(500),
  category: z.enum(['technology', 'politics', 'economics', 'culture', 'science', 'military']),
  impact: z.enum(['low', 'medium', 'high', 'critical']),
  causalityStrength: z.number().min(0).max(1)
    .describe("How directly caused by the divergence point (0=independent, 0.5=indirect, 1=direct)"),
  affectedEntities: z.array(z.object({
    type: z.enum(['company', 'person', 'product', 'country', 'technology']),
    name: z.string(),
    role: z.string().describe("How this entity is affected"),
  })).max(5),
});

export const DecadeEventsSchema = z.object({
  events: z.array(GeneratedEventSchema).min(3).max(8)
    .describe("Events for this decade, ordered chronologically"),
  decadeSummary: z.string().max(200).describe("One-paragraph summary of the decade"),
});
```

### 3.3 Company Generation

```typescript
// src/schemas/company.ts
export const GeneratedCompanySchema = z.object({
  name: z.string().describe("Realistic company name for the era and industry"),
  foundedYear: z.number().int(),
  industry: z.string(),
  valuation: z.number().min(0).describe("Company valuation in USD"),
  headquarters: z.string().describe("City name"),
  ceo: z.object({
    name: z.string().describe("Full name"),
    background: z.string().max(100),
  }),
  status: z.enum(['startup', 'growing', 'established', 'acquired', 'defunct', 'ipo']),
  description: z.string().max(300),
  keyProduct: z.string().describe("Main product or service"),
  employees: z.number().int().min(0),
});
```

### 3.4 Product Generation

```typescript
// src/schemas/product.ts
export const GeneratedProductSchema = z.object({
  name: z.string().describe("Catchy, era-appropriate product name"),
  category: z.enum(['communication', 'computing', 'transportation', 'medicine', 'entertainment', 'energy']),
  launchYear: z.number().int(),
  description: z.string().max(300),
  impact: z.enum(['minor', 'moderate', 'significant', 'revolutionary']),
  priceUSD: z.number().min(0),
  manufacturer: z.string().describe("Company name that makes this"),
  specifications: z.record(z.string(), z.string())
    .describe("Key specs as key-value pairs"),
});
```

### 3.5 Person Generation

```typescript
// src/schemas/person.ts
export const GeneratedPersonSchema = z.object({
  name: z.string().describe("Full name, culturally appropriate"),
  bornYear: z.number().int(),
  diedYear: z.number().int().nullable(),
  nationality: z.string(),
  occupation: z.string(),
  biography: z.string().max(500),
  significance: z.enum(['low', 'medium', 'high', 'legendary']),
  achievements: z.array(z.string()).min(1).max(5),
  alternateFate: z.string().max(300)
    .describe("How their life differs from real history"),
  realWorldEquivalent: z.string().nullable()
    .describe("Name of real person this is based on, if any"),
});
```

### 3.6 News Article Generation

```typescript
// src/schemas/news.ts
export const GeneratedNewsArticleSchema = z.object({
  newspaperName: z.string(),
  date: z.string().describe("ISO date string YYYY-MM-DD"),
  headline: z.string().min(10).max(150),
  subheadline: z.string().max(200).optional(),
  body: z.string().min(200).max(2000),
  author: z.string(),
  category: z.enum(['technology', 'politics', 'economics', 'culture', 'science', 'world']),
  mentionedEntities: z.array(z.object({
    type: z.enum(['company', 'person', 'product', 'country']),
    name: z.string(),
  })).max(5),
});
```

### 3.7 Country Generation

```typescript
// src/schemas/country.ts
export const GeneratedCountrySchema = z.object({
  name: z.string(),
  isoCode: z.string().length(2),
  formedYear: z.number().int(),
  dissolvedYear: z.number().int().nullable(),
  governmentType: z.enum(['democracy', 'republic', 'monarchy', 'technocracy', 'authoritarian', 'federation', 'theocracy']),
  population: z.number().int().min(0),
  gdp: z.number().min(0),
  technologyLevel: z.enum(['primitive', 'developing', 'modern', 'advanced', 'futuristic']),
  description: z.string().max(500),
  neighbors: z.array(z.string()).describe("ISO codes of bordering countries"),
  allies: z.array(z.string()).describe("ISO codes of allied countries"),
  rivals: z.array(z.string()).describe("ISO codes of rival countries"),
});
```

---

## 4. LLM Chains

### 4.1 Timeline Generation Chain

```typescript
// src/lib/ai/chains/timeline.ts
import { generateObject } from 'ai';
import { z } from 'zod';
import { models } from '../provider';
import { DivergenceInputSchema, DecadeEventsSchema } from '@/schemas';

export async function generateTimeline(divergence: DivergenceInput): Promise<DecadeResult[]> {
  const decades: DecadeResult[] = [];
  const startYear = divergence.year;
  const endYear = Math.min(startYear + 200, 2100);
  
  for (let decade = startYear; decade < endYear; decade += 10) {
    const { object } = await generateObject({
      model: models.timeline,
      schema: DecadeEventsSchema,
      prompt: `You are simulating an alternate timeline where ${divergence.description}.
      
      Generate events for the decade ${decade}-${decade + 9}.
      
      Context: ${divergence.description}
      Divergence type: ${divergence.type}
      Magnitude: ${divergence.magnitude}
      
      ${decades.length > 0 ? `Previous decades: ${JSON.stringify(decades.slice(-2))}` : ''}
      
      Generate 3-8 events that would realistically occur in this decade as a consequence of the divergence.
      Each event should have causal connections to the divergence or to previous events.
      Include a mix of direct consequences and emergent effects.`,
    });
    
    decades.push({ decade, ...object });
  }
  
  return decades;
}
```

### 4.2 Entity Generation Chain

```typescript
// src/lib/ai/chains/entities.ts
import { generateObject } from 'ai';
import { models } from '../provider';
import { GeneratedCompanySchema, GeneratedProductSchema, GeneratedPersonSchema } from '@/schemas';

export async function generateCompaniesForDecade(
  decade: number,
  timelineContext: string,
  existingCompanies: string[]
): Promise<GeneratedCompany[]> {
  const { object } = await generateObject({
    model: models.entity,
    schema: z.object({
      companies: z.array(GeneratedCompanySchema).min(2).max(5),
    }),
    prompt: `Generate ${2 + Math.floor(Math.random() * 4)} companies that would exist in this alternate timeline.
    
    Timeline context: ${timelineContext}
    Decade: ${decade}s
    Existing companies to avoid duplicating: ${existingCompanies.join(', ')}
    
    Companies should reflect the technology level and culture of this timeline.
    Names should be era-appropriate and realistic.`,
  });
  
  return object.companies;
}
```

---

## 5. Caching Strategy

### 5.1 Cache Layers

| Layer | Backend | TTL | Hit Rate Expected |
|---|---|---|---|
| **Exact match** | Redis | 24h | 15-20% |
| **Semantic** | Redis + embeddings | 24h | 25-35% |
| **Schema version** | Redis | Until schema changes | - |

### 5.2 Cache Key Design

```typescript
// src/lib/cache/keys.ts
import crypto from 'crypto';

export function buildCacheKey(params: {
  chain: string;
  prompt: string;
  schemaVersion: string;
  model: string;
}): string {
  const hash = crypto
    .createHash('sha256')
    .update(JSON.stringify({
      chain: params.chain,
      prompt: params.prompt,
      schema: params.schemaVersion,
      model: params.model,
    }))
    .digest('hex')
    .slice(0, 16);
  
  return `chronos:${params.chain}:${hash}`;
}
```

### 5.3 Request Coalescing

```typescript
// src/lib/cache/coalesce.ts
const inFlight = new Map<string, Promise<any>>();

export async function coalescedGenerate<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (inFlight.has(key)) {
    return inFlight.get(key)! as Promise<T>;
  }
  
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
```

---

## 6. Rate Limiting & Cost Control

### 6.1 Tiered Limits

| Tier | RPM | TPM (tokens/min) | Monthly Budget | Max Timeline Length |
|---|---|---|---|---|
| **Free** | 10 | 10,000 | $0 | 50 years |
| **Pro** | 50 | 50,000 | $10 | 200 years |
| **Enterprise** | 200 | 200,000 | $50 | 500 years |

### 6.2 Cost Estimation per Simulation

| Level | Model | Est. Tokens | Est. Cost |
|---|---|---|---|
| L1 Timeline (50 years) | Claude Sonnet | ~50K input + 30K output | ~$0.30 |
| L2 Companies (20 entities) | GPT-4o | ~30K input + 20K output | ~$0.25 |
| L3 Products (20 entities) | GPT-4o | ~20K input + 15K output | ~$0.18 |
| L4 People (10 biographies) | Claude Sonnet | ~15K input + 20K output | ~$0.20 |
| L5 News (10 articles) | GPT-4o | ~20K input + 25K output | ~$0.25 |
| L6 Wikipedia (15 articles) | Claude Sonnet | ~30K input + 40K output | ~$0.40 |
| L7 Map (30 countries) | Claude Sonnet | ~40K input + 30K output | ~$0.35 |
| L8 Economics (300 snapshots) | GPT-4o-mini | ~50K input + 40K output | ~$0.05 |
| L9 Consistency check | GPT-4o-mini | ~30K input + 5K output | ~$0.02 |
| **Total per full sim** | | | **~$2.00** |

### 6.3 Budget-Aware Fallback

```typescript
// src/lib/ai/fallback.ts
import { models } from './provider';

export function getModelWithFallback(
  primary: keyof typeof models,
  budgetRemaining: number
) {
  if (budgetRemaining < 0.01) {
    return models.fallback; // cheapest model
  }
  return models[primary];
}
```

---

## 7. Prompt Engineering Patterns

### 7.1 System Prompt Template

```typescript
// src/lib/ai/prompts/system.ts
export function systemPrompt(timelineContext: string): string {
  return `You are the Chronos Engine, an AI system that simulates alternate historical realities.

CRITICAL RULES:
1. Every generation must be internally consistent with the timeline context.
2. Never reference real-world events that haven't been mentioned in the timeline.
3. All entities (companies, people, products) must be fictional.
4. Causal chains must be logical and follow from the divergence point.
5. Technology progression must be realistic for the era.
6. Cultural references must match the alternate reality.

Timeline Context:
${timelineContext}

Output Format:
Always respond with valid JSON matching the provided schema.
Never include markdown, code blocks, or explanations outside the JSON.`;
}
```

### 7.2 Consistency Enforcement

```typescript
// src/lib/ai/consistency.ts
export function consistencyCheckPrompt(
  generatedContent: any,
  existingEntities: string[]
): string {
  return `You are a consistency validator for an alternate timeline.

Generated content: ${JSON.stringify(generatedContent)}

Existing entities in this timeline: ${existingEntities.join(', ')}

Check for:
1. Does every referenced entity exist in the existing list?
2. Are dates/times consistent?
3. Are causal relationships logical?
4. Are there any contradictions?

Return a JSON object:
{
  "consistent": boolean,
  "issues": [{ "type": string, "description": string, "severity": "low"|"medium"|"high" }],
  "suggestedFixes": [{ "issue": string, "fix": string }]
}`;
}
```

---

## 8. Streaming Strategy

```typescript
// src/app/api/simulate/route.ts
export async function POST(req: Request) {
  const { divergence } = await req.json();
  
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Phase 1: Parse divergence
      controller.enqueue(encoder.encode(
        JSON.stringify({ type: 'phase', phase: 'parsing' }) + '\n'
      ));
      const parsed = await parseDivergence(divergence);
      controller.enqueue(encoder.encode(
        JSON.stringify({ type: 'parsed', data: parsed }) + '\n'
      ));
      
      // Phase 2: Generate per decade
      for (const decade of getDecades(parsed.year)) {
        controller.enqueue(encoder.encode(
          JSON.stringify({ type: 'phase', phase: 'generating', decade }) + '\n'
        ));
        
        const events = await generateDecadeEvents(decade, parsed);
        controller.enqueue(encoder.encode(
          JSON.stringify({ type: 'events', decade, data: events }) + '\n'
        ));
        
        const companies = await generateCompaniesForDecade(decade, parsed);
        controller.enqueue(encoder.encode(
          JSON.stringify({ type: 'companies', decade, data: companies }) + '\n'
        ));
      }
      
      // Phase 3: Validate consistency
      controller.enqueue(encoder.encode(
        JSON.stringify({ type: 'phase', phase: 'validating' }) + '\n'
      ));
      const validation = await validateConsistency(parsed);
      controller.enqueue(encoder.encode(
        JSON.stringify({ type: 'validation', data: validation }) + '\n'
      ));
      
      controller.close();
    }
  });
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

---

## 9. Error Handling

```typescript
// src/lib/ai/errors.ts
export class LLMError extends Error {
  constructor(
    message: string,
    public provider: string,
    public model: string,
    public statusCode?: number,
    public retryable: boolean = false
  ) {
    super(message);
    this.name = 'LLMError';
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  backoffMs = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      if (error instanceof LLMError && !error.retryable) throw error;
      
      const delay = backoffMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Unreachable');
}
```
