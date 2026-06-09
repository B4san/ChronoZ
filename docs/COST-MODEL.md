# Chronos Engine — Cost Model

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Infrastructure Costs

### 1.1 Vercel (Hosting)

| Plan | Monthly | Features |
|---|---|---|
| Hobby | $0 | Personal projects, 100GB bandwidth |
| Pro | $20/user | Team features, 1TB bandwidth, analytics |
| Enterprise | Custom | SLA, SSO, dedicated support |

**Recommendation:** Pro plan ($20/mes)

### 1.2 Neo4j Aura (Graph Database)

| Plan | Monthly | Nodes | Relationships |
|---|---|---|---|
| Free | $0 | 50K | 175K |
| Professional | $65 | 500K | 1.75M |
| Business | $225 | 2M | 7M |
| Enterprise | Custom | Unlimited | Unlimited |

**Recommendation:** Start with Professional ($65/mes), scale to Business when needed

### 1.3 Upstash (Redis)

| Plan | Monthly | Features |
|---|---|---|
| Pay-as-you-go | ~$5-15 | 10K commands/day free |
| Pro | $10 | 100K commands/day |

**Recommendation:** Pay-as-you-go (~$10/mes promedio)

### 1.4 Auth (NextAuth + OAuth)

| Provider | Monthly | Notes |
|---|---|---|
| Google OAuth | Free | 10K sign-ins/mes |
| GitHub OAuth | Free | Unlimited |
| NextAuth.js | Free | Open source |

**Recommendation:** Free tier

### 1.5 Monitoring (Sentry)

| Plan | Monthly | Features |
|---|---|---|
| Developer | $0 | 5K errors/mes |
| Team | $26 | 50K errors, alerts |

**Recommendation:** Start with Developer, upgrade when needed

---

## 2. LLM API Costs

### 2.1 Pricing by Provider (as of 2026)

| Provider | Model | Input (per 1M tokens) | Output (per 1M tokens) |
|---|---|---|---|
| OpenAI | GPT-4o | $2.50 | $10.00 |
| OpenAI | GPT-4o-mini | $0.15 | $0.60 |
| Anthropic | Claude Sonnet 4 | $3.00 | $15.00 |
| Anthropic | Claude Haiku | $0.25 | $1.25 |

### 2.2 Cost per Simulation (Full Timeline)

| Level | Model | Est. Input Tokens | Est. Output Tokens | Est. Cost |
|---|---|---|---|---|
| L1: Timeline (100 years) | Claude Sonnet | 50K | 30K | $0.30 |
| L2: Companies (40 entities) | GPT-4o | 30K | 20K | $0.28 |
| L3: Products (35 entities) | GPT-4o | 20K | 15K | $0.20 |
| L4: People (25 biographies) | Claude Sonnet | 15K | 20K | $0.35 |
| L5: News (50 articles) | GPT-4o | 20K | 25K | $0.30 |
| L6: Wikipedia (35 articles) | Claude Sonnet | 30K | 40K | $0.69 |
| L7: Map (25 countries) | Claude Sonnet | 40K | 30K | $0.57 |
| L8: Economics (250 snapshots) | GPT-4o-mini | 50K | 40K | $0.03 |
| L9: Consistency check | GPT-4o-mini | 30K | 5K | $0.01 |
| **Total per full simulation** | | **~285K** | **~225K** | **~$2.73** |

### 2.3 With Caching (Estimated)

Cache hit rates based on similar content:
- Exact match: 15-20% reduction
- Semantic: 25-35% reduction
- **Effective cost per simulation with caching: ~$1.80-$2.20**

---

## 3. Monthly Cost Projections

### 3.1 Scenario: 100 Users, 500 Simulations/Month

| Item | Monthly Cost |
|---|---|
| Vercel Pro | $20 |
| Neo4j Aura Professional | $65 |
| Upstash Redis | $10 |
| LLM API (500 sims × $2.00 avg) | $1,000 |
| Sentry (if needed) | $0-26 |
| Domain + misc | $15 |
| **Total** | **~$1,110-$1,136** |

### 3.2 Scenario: 1,000 Users, 5,000 Simulations/Month

| Item | Monthly Cost |
|---|---|
| Vercel Pro | $40 |
| Neo4j Aura Business | $225 |
| Upstash Pro | $10 |
| LLM API (5000 sims × $1.80 avg w/caching) | $9,000 |
| Sentry Team | $26 |
| Monitoring (Datadog) | $50 |
| Domain + misc | $20 |
| **Total** | **~$9,371** |

### 3.3 Scenario: 10,000 Users, 50,000 Simulations/Month

| Item | Monthly Cost |
|---|---|
| Vercel Enterprise | $500 |
| Neo4j Aura Enterprise | Custom (~$1,000) |
| Upstash Enterprise | ~$100 |
| LLM API (50K sims × $1.50 avg w/caching + optimization) | $75,000 |
| Sentry | $100 |
| Monitoring + CDN | $200 |
| Misc | $100 |
| **Total** | **~$77,000** |

---

## 4. Cost Optimization Strategies

### 4.1 LLM Cost Reduction

| Strategy | Expected Savings | Implementation |
|---|---|---|
| **Caching** | 25-35% | Redis exact + semantic cache |
| **Smaller models for simple tasks** | 40-60% | GPT-4o-mini for parsing, validation |
| **Batch generation** | 10-15% | Generate multiple entities in one call |
| **Prompt optimization** | 10-20% | Reduce token count per call |
| **Response compression** | 5-10% | Shorter outputs where possible |
| **User tier limits** | N/A | Free tier = fewer, simpler sims |

### 4.2 Database Cost Reduction

| Strategy | Expected Savings |
|---|---|
| **Connection pooling** | 30-40% fewer connections |
| **Read replicas** | Spread read load |
| **Indexing** | Faster queries, less compute |
| **Data archival** | Move old timelines to cold storage |

---

## 5. Revenue Model (Future)

| Tier | Price | Includes |
|---|---|---|
| Free | $0/mes | 3 timelines, L1-L3 only, 50 years max |
| Pro | $9/mes | Unlimited timelines, all levels, 200 years |
| Enterprise | $49/mes | API access, custom models, priority |

### Break-Even Analysis

- **Free tier:** Max 3 timelines, ~$6 LLM cost/user
- **Pro tier ($9):** ~$2 LLM cost/user → $7 margin
- **At 1,000 Pro users:** $7,000 margin → covers ~$9,371 costs partially
- **At 3,000 Pro users:** $21,000 margin → profitable

---

## 6. Monitoring Dashboard

Track in real-time:

```typescript
interface CostMetrics {
  // LLM
  dailyTokenUsage: number;
  dailyCostUSD: number;
  costByModel: Record<string, number>;
  costByUser: Record<string, number>;
  
  // Infrastructure
  neo4jNodeCount: number;
  neo4jRelationshipCount: number;
  redisMemoryUsage: number;
  vercelBandwidthGB: number;
  
  // Business
  activeUsers: number;
  simulationsRun: number;
  avgCostPerSimulation: number;
  cacheHitRate: number;
}
```
