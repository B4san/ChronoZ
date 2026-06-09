# Chronos Engine — Testing Strategy

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Testing Pyramid

```
        ╱╲
       ╱ E2E ╲         10% - Playwright
      ╱────────╲
     ╱Integration╲      30% - Neo4j testcontainers, API tests
    ╱──────────────╲
   ╱    Unit Tests   ╲   60% - Vitest, fast, isolated
  ╱────────────────────╲
```

---

## 2. Unit Tests (Vitest)

### 2.1 What to Test

| Module | Test Focus |
|---|---|
| `schemas/` | Zod schema validation, edge cases |
| `lib/ai/` | Provider abstraction, caching, rate limiting |
| `lib/neo4j/` | Query builders, mappers |
| `lib/simulation/` | Causal propagation, economic models |
| `lib/cache/` | Cache key generation, coalescing |
| `components/` | Rendering, user interactions |

### 2.2 Example Tests

```typescript
// tests/unit/schemas/divergence.test.ts
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
});
```

```typescript
// tests/unit/lib/cache/keys.test.ts
import { describe, it, expect } from 'vitest';
import { buildCacheKey } from '@/lib/cache/keys';

describe('buildCacheKey', () => {
  it('generates consistent keys for same input', () => {
    const key1 = buildCacheKey({
      chain: 'timeline',
      prompt: 'Internet in 1950',
      schemaVersion: '1.0',
      model: 'gpt-4o',
    });
    const key2 = buildCacheKey({
      chain: 'timeline',
      prompt: 'Internet in 1950',
      schemaVersion: '1.0',
      model: 'gpt-4o',
    });
    expect(key1).toBe(key2);
  });

  it('generates different keys for different prompts', () => {
    const key1 = buildCacheKey({
      chain: 'timeline',
      prompt: 'Internet in 1950',
      schemaVersion: '1.0',
      model: 'gpt-4o',
    });
    const key2 = buildCacheKey({
      chain: 'timeline',
      prompt: 'Nuclear energy in 1980',
      schemaVersion: '1.0',
      model: 'gpt-4o',
    });
    expect(key1).not.toBe(key2);
  });
});
```

---

## 3. Integration Tests

### 3.1 Neo4j Integration

```typescript
// tests/integration/neo4j/timeline.test.ts
import { Neo4jContainer } from '@testcontainers/neo4j';
import { afterAll, beforeAll, describe, it, expect } from 'vitest';

describe('Timeline Neo4j Operations', () => {
  let container: Neo4jContainer;
  let driver: neo4j.Driver;

  beforeAll(async () => {
    container = await new Neo4jContainer().start();
    driver = neo4j.driver(
      container.getBoltUri(),
      neo4j.auth.basic(container.getUsername(), container.getPassword())
    );
    await createIndexes(driver);
  });

  afterAll(async () => {
    await driver.close();
    await container.stop();
  });

  it('creates and retrieves a timeline', async () => {
    const timeline = await createTimeline(driver, {
      name: 'Internet in 1950',
      divergenceYear: 1950,
    });

    const retrieved = await getTimeline(driver, timeline.id);
    expect(retrieved.name).toBe('Internet in 1950');
    expect(retrieved.divergenceYear).toBe(1950);
  });

  it('creates events and links them to timeline', async () => {
    const timeline = await createTimeline(driver, {
      name: 'Test Timeline',
      divergenceYear: 1950,
    });

    const event = await createEvent(driver, {
      timelineId: timeline.id,
      year: 1955,
      title: 'First network launched',
    });

    const events = await getTimelineEvents(driver, timeline.id);
    expect(events).toHaveLength(1);
    expect(events[0].year).toBe(1955);
  });

  it('detects temporal inconsistencies', async () => {
    const timeline = await createTimeline(driver, { name: 'Test' });
    
    await createEvent(driver, {
      timelineId: timeline.id,
      year: 1955,
      title: 'Cause',
    });
    
    await createEvent(driver, {
      timelineId: timeline.id,
      year: 1950,
      title: 'Effect',
    });

    // Link: 1955 caused 1950 (impossible)
    await linkCausal(driver, 'cause_id', 'effect_id');
    
    const issues = await detectTemporalInconsistencies(driver, timeline.id);
    expect(issues).toHaveLength(1);
  });
});
```

### 3.2 API Integration

```typescript
// tests/integration/api/timelines.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMocks } from 'node-mocks-http';
import { POST } from '@/app/api/v1/timelines/route';

describe('POST /api/v1/timelines', () => {
  it('creates a timeline with valid input', async () => {
    const request = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        divergence: 'Internet invented in 1950',
      }),
    });

    const response = await POST(request as any);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.id).toBeDefined();
    expect(data.status).toBe('generating');
  });

  it('returns 400 for invalid input', async () => {
    const request = new Request('http://localhost/api/v1/timelines', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        divergence: 'ab', // too short
      }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });
});
```

---

## 4. E2E Tests (Playwright)

### 4.1 Critical User Flows

```typescript
// tests/e2e/timeline-creation.spec.ts
import { test, expect } from '@playwright/test';

test('user can create a timeline', async ({ page }) => {
  await page.goto('/');
  
  // Type divergence
  await page.fill('[data-testid="divergence-input"]', 'Internet invented in 1950');
  await page.click('[data-testid="create-button"]');
  
  // Wait for generation to start
  await expect(page.locator('[data-testid="streaming-indicator"]')).toBeVisible();
  
  // Wait for events to appear
  await expect(page.locator('[data-testid="event-card"]').first()).toBeVisible({ timeout: 60000 });
  
  // Verify events are in chronological order
  const years = await page.locator('[data-testid="event-year"]').allTextContents();
  const sortedYears = [...years].sort();
  expect(years).toEqual(sortedYears);
});

test('user can explore entity details', async ({ page }) => {
  // Assuming a timeline already exists
  await page.goto('/timeline/tl_abc123');
  
  // Click on a company
  await page.click('[data-testid="company-card"]:first-child');
  
  // Verify detail panel opens
  await expect(page.locator('[data-testid="entity-detail"]')).toBeVisible();
  await expect(page.locator('[data-testid="entity-name"]')).not.toBeEmpty();
});

test('user can navigate years on map', async ({ page }) => {
  await page.goto('/timeline/tl_abc123/map');
  
  // Use year slider
  await page.fill('[data-testid="year-slider"]', '1990');
  
  // Verify map updates
  await expect(page.locator('[data-testid="map-container"]')).toBeVisible();
  await expect(page.locator('[data-testid="year-display"]')).toContainText('1990');
});
```

---

## 5. LLM Output Validation Tests

```typescript
// tests/integration/ai/output-validation.test.ts
import { describe, it, expect } from 'vitest';
import { generateObject } from 'ai';
import { models } from '@/lib/ai/provider';
import { GeneratedCompanySchema } from '@/schemas';

describe('LLM Output Validation', () => {
  it('generates valid company data', async () => {
    const { object } = await generateObject({
      model: models.entity,
      schema: GeneratedCompanySchema,
      prompt: 'Generate a tech company founded in the 1960s in an alternate timeline where the internet was invented in 1950.',
    });

    const result = GeneratedCompanySchema.safeParse(object);
    expect(result.success).toBe(true);
    expect(result.data!.foundedYear).toBeGreaterThanOrEqual(1960);
    expect(result.data!.foundedYear).toBeLessThan(1970);
    expect(result.data!.valuation).toBeGreaterThan(0);
  });

  it('generates consistent person biography', async () => {
    const { object } = await generateObject({
      model: models.timeline,
      schema: GeneratedPersonSchema,
      prompt: 'Generate an alternate biography for a scientist in a timeline where quantum physics was discovered in 1880.',
    });

    const result = GeneratedPersonSchema.safeParse(object);
    expect(result.success).toBe(true);
    expect(result.data!.biography.length).toBeGreaterThan(50);
    expect(result.data!.alternateFate.length).toBeGreaterThan(20);
  });
});
```

---

## 6. Performance Tests

```typescript
// tests/performance/timeline-generation.test.ts
import { describe, it, expect } from 'vitest';

describe('Timeline Generation Performance', () => {
  it('generates a 50-year timeline in under 30 seconds', async () => {
    const start = Date.now();
    
    const timeline = await generateTimeline({
      divergence: 'Internet invented in 1950',
      maxYears: 50,
    });
    
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(30000);
    expect(timeline.events.length).toBeGreaterThanOrEqual(10);
  });

  it('concurrent generations do not exceed rate limits', async () => {
    const promises = Array.from({ length: 5 }, () =>
      generateTimeline({ divergence: 'Test scenario', maxYears: 20 })
    );
    
    const results = await Promise.allSettled(promises);
    const successes = results.filter(r => r.status === 'fulfilled');
    
    // At least 3 out of 5 should succeed (some may hit rate limits)
    expect(successes.length).toBeGreaterThanOrEqual(3);
  });
});
```

---

## 7. Test Configuration

### 7.1 Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/app/',
        '*.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 7.2 Playwright Config

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 8. CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:unit
      - run: npm run test:coverage

  integration-tests:
    runs-on: ubuntu-latest
    services:
      neo4j:
        image: neo4j:5
        env:
          NEO4J_AUTH: neo4j/testpassword
        ports:
          - 7687:7687
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run test:integration
        env:
          NEO4J_URI: bolt://localhost:7687
          NEO4J_USER: neo4j
          NEO4J_PASSWORD: testpassword
          REDIS_URL: redis://localhost:6379

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
```

---

## 9. Coverage Targets

| Category | Target | Current |
|---|---|---|
| Unit tests | >80% | - |
| Integration tests | >60% | - |
| E2E critical flows | 100% | - |
| Overall | >75% | - |
