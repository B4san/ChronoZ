# Chronos Engine — Project Index

**Version:** 1.0  
**Date:** June 9, 2026

---

## Project Structure

```
ChronoZ/
├── .acfm/                    # AC Framework configuration
│   ├── config.yaml
│   ├── changes/              # Active changes
│   ├── specs/                # Specifications
│   ├── project-constitution.md
│   ├── security-guidelines.md
│   ├── quality-standards.md
│   └── react-nextjs-best-practices.md
├── docs/                     # Project documentation
│   ├── PRD.md               # Product Requirements
│   ├── ARCHITECTURE.md      # Technical Architecture
│   ├── ROADMAP.md           # Development Roadmap
│   ├── KNOWLEDGE-GRAPH.md   # Neo4j Schema
│   ├── AI-STRATEGY.md       # LLM Integration
│   ├── API.md               # API Design
│   ├── DATA-MODELS.md       # TypeScript Interfaces
│   ├── UI-UX.md             # UI/UX Design
│   ├── SECURITY.md          # Security & Auth
│   ├── COST-MODEL.md        # Cost Estimation
│   ├── TESTING.md           # Testing Strategy
│   └── user-stories/        # User Stories
│       ├── EPICS.md
│       ├── L1-TIMELINE.md
│       └── ...
└── src/                      # Source code (to be created)
    ├── app/                  # Next.js App Router
    ├── components/           # React components
    ├── lib/                  # Business logic
    ├── schemas/              # Zod schemas
    ├── types/                # TypeScript types
    └── hooks/                # React hooks
```

---

## Domains

| Domain | Description | Key Files |
|---|---|---|
| **Timeline Generation** | Core simulation engine | L1-TIMELINE.md, AI-STRATEGY.md |
| **Entity Management** | Companies, people, products | L2-COMPANIES.md, L3-PRODUCTS.md |
| **Knowledge Graph** | Neo4j persistence layer | KNOWLEDGE-GRAPH.md |
| **LLM Integration** | Multi-provider AI gateway | AI-STRATEGY.md |
| **Visual UI** | Timeline explorer, maps, dashboards | UI-UX.md |
| **Security** | Auth, rate limiting, input validation | SECURITY.md |

---

## Key Decisions

1. **Next.js + TypeScript** — Full-stack React framework
2. **Neo4j** — Native graph database for knowledge graph
3. **Vercel AI SDK** — Multi-provider LLM abstraction
4. **Zod** — Runtime + compile-time type safety
5. **Serverless (Vercel)** — Auto-scaling, pay-per-use

---

## External References

- [Neo4j TypeScript Driver](https://neo4j.com/docs/javascript-manual/current/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Next.js 14 Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
