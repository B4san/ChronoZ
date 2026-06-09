# Chronos Engine — Exploration Notes

**Version:** 1.0  
**Date:** June 9, 2026

---

## Architecture Research

### Neo4j Knowledge Graph
- **Bitemporal versioning** pattern for timeline entities
- **Three-phase ingestion:** nodes → relationships → version closure
- **Index-free adjacency** makes multi-hop traversals O(1)
- **Parallel runtime** (Neo4j 5.13+) for analytical queries

### LLM Multi-Provider
- **Vercel AI SDK** is lighter than LangChain.js, better Next.js integration
- **Structured output** via Zod schemas + `generateObject()`
- **`ai-sdk-rate-limiter`** for cost-aware rate limiting
- **Two-layer caching:** exact match (Redis) + semantic (embeddings)

### Procedural Generation
- **System Dynamics** (causal loop diagrams) for effect propagation
- **Markov chains** for name generation (train on real data per era)
- **Wave Function Collapse** for consistent layout generation
- **Stock-and-flow** modeling for economic simulation

---

## Integration Points

```
User Input → Divergence Parser (LLM)
    → Historical Context Builder (Neo4j query)
    → Simulation Engine (LLM chain per decade)
        → Event Generator
        → Company Generator
        → Product Generator
    → Consistency Validator (Neo4j queries)
    → Response (SSE stream)
```

---

## Key Risks Identified

1. **LLM output quality** — Inconsistent generations → Retry + validation
2. **Neo4j complexity** — Schema evolution → Start simple, iterate
3. **Cost management** — LLM costs scale linearly → Aggressive caching
4. **Consistency enforcement** — Hard to guarantee → Multi-pass validation
