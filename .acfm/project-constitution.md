# Chronos Engine — Project Constitution

**Version:** 1.0  
**Date:** June 9, 2026

---

## Core Principles

### 1. Quality Over Speed
Every feature must be internally consistent, well-tested, and production-ready. We do not ship half-baked simulations.

### 2. Documentation Before Code
No code is written without a spec, a design, and acceptance criteria. The docs/ folder is the source of truth.

### 3. Consistency Is King
The Knowledge Graph must never contain contradictions. A simulation with inconsistencies is worse than no simulation.

### 4. User Experience First
Streaming, progressive loading, beautiful visualizations. The user should feel like they're exploring a real alternate world.

### 5. Cost-Conscious AI
Every LLM call must be justified. Cache aggressively, use cheaper models for simple tasks, and never waste tokens.

### 6. Incremental Complexity
Ship L1-L3 first (MVP), then layer on complexity. Each level must work independently.

### 7. Type Safety Everywhere
TypeScript strict mode. Zod schemas for all external data. No `any` types.

### 8. Test-Driven Development
Write tests before implementation. Every public function has tests.

---

## Architecture Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR, streaming, server components |
| Language | TypeScript (strict) | Type safety, IDE support |
| Graph DB | Neo4j 5.x | Native graph queries, Cypher |
| Cache | Redis (Upstash) | Serverless-friendly, rate limiting |
| LLM | Vercel AI SDK (multi-provider) | Provider abstraction, streaming |
| Auth | NextAuth.js v5 | OAuth + credentials |
| UI | shadcn/ui + Tailwind | Accessible, customizable |
| Testing | Vitest + Playwright | Speed + browser testing |
| Deployment | Vercel | Serverless, auto-scaling |

---

## Code Style

- **Formatter:** Prettier (default config)
- **Linter:** ESLint with Next.js rules
- **Naming:** camelCase for variables/functions, PascalCase for components/types
- **Imports:** Use `@/` path aliases
- **Exports:** Named exports only (no default exports except page components)
- **Error handling:** Always use typed errors, never swallow exceptions
- **Comments:** Only for complex business logic, never for obvious code

---

## Security Rules

1. Never commit secrets, API keys, or credentials
2. Always validate input with Zod before processing
3. Use parameterized queries for Neo4j (never string concatenation)
4. Sanitize user input before sending to LLM
5. Implement rate limiting on all API endpoints
6. Use HttpOnly cookies for session management
7. Enable CORS only for allowed origins
8. Log security-relevant events for audit

---

## Definition of Done

A feature is DONE when:
- [ ] Code is written and follows style guide
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Responsive on mobile/tablet/desktop
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Documentation updated
- [ ] Deployed to staging
- [ ] Product owner approved

---

## Constraints

- **Budget:** LLM costs must stay under $0.50 per simulation
- **Latency:** <30s for L1-L3, <60s for L4-L6, <120s for L7-L10
- **Scale:** Support 1000+ concurrent timelines
- **Availability:** 99.9% uptime
- **Consistency:** Score ≥90% for generated timelines
