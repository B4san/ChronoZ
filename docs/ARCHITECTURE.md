# Chronos Engine — Technical Architecture

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. System Overview

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│                   Next.js 14+ (App Router)               │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Timeline │ │  Map     │ │ Entity   │ │ Explorer │  │
│  │ Explorer │ │  View    │ │ Cards    │ │ Panels   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │ API Routes + SSE
┌─────────────────────┴───────────────────────────────────┐
│                    API LAYER                             │
│              Next.js API Routes / Route Handlers          │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │Timeline  │ │Entity    │ │Simulation│ │ Auth     │  │
│  │CRUD      │ │Query     │ │Engine    │ │ Routes   │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└────────┬──────────┬──────────┬──────────┬───────────────┘
         │          │          │          │
┌────────┴───┐ ┌────┴────┐ ┌──┴───┐ ┌───┴────────┐
│  Neo4j     │ │  LLM    │ │Cache │ │  Queue     │
│  (Graph DB)│ │Providers│ │Redis │ │  (Bull MQ) │
└────────────┘ └─────────┘ └──────┘ └────────────┘
```

---

## 2. Tech Stack

| Capa | Tecnología | Justificación |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router), React 18, TypeScript | SSR/SSG, streaming, server components |
| **UI Components** | shadcn/ui + Tailwind CSS | Componentes accesibles, customizables |
| **Visualización** | D3.js (timelines), Leaflet/Mapbox (maps), Recharts (charts) | Librerías maduras para cada tipo de viz |
| **API** | Next.js Route Handlers | Integración nativa con frontend |
| **Auth** | NextAuth.js v5 | OAuth + credentials, session management |
| **Graph DB** | Neo4j 5.x (Aura) | Graph queries nativas, Cypher |
| **Cache** | Redis (Upstash) | Serverless-friendly, rate limiting |
| **Queue** | BullMQ + Redis | Job scheduling para simulaciones largas |
| **LLM** | Vercel AI SDK (multi-provider) | OpenAI, Anthropic, fallback routing |
| **Rate Limiting** | ai-sdk-rate-limiter | Token-based, cost-aware |
| **Validation** | Zod | Runtime + compile-time type safety |
| **Testing** | Vitest (unit), Playwright (E2E) | Speed + browser testing |
| **Deployment** | Vercel (frontend) + Neo4j Aura (DB) + Upstash (Redis) | Serverless, auto-scaling |

---

## 3. Service Boundaries

### 3.1 Timeline Service
- CRUD de timelines
- Generación procedural de eventos
- Navegación temporal

### 3.2 Entity Service
- Generación de empresas, personas, productos
- Query y búsqueda de entidades
- Relaciones entre entidades

### 3.3 Simulation Engine
- Propagación causal (eventos → efectos)
- Simulación económica
- Motor de consistencia

### 3.4 LLM Gateway
- Multi-provider abstraction
- Structured output generation
- Caching de respuestas
- Rate limiting y cost tracking

### 3.5 Knowledge Graph Manager
- Operaciones Neo4j (CRUD)
- Consultas de grafos
- Detección de inconsistencias

---

## 4. Data Flow — Generación de Timeline

```
1. User Input: "Internet inventado en 1950"
         │
         ▼
2. Divergence Parser (LLM)
   → Extrae: { year: 1950, subject: "internet", type: "technology" }
         │
         ▼
3. Historical Context Builder
   → Consulta knowledge graph del mundo real pre-1950
   → Construye contexto para el LLM
         │
         ▼
4. Simulation Engine
   → Para cada década (1950-2050):
     a. Genera eventos causales (LLM structured output)
     b. Genera entidades afectadas (empresas, personas)
     c. Actualiza knowledge graph
     d. Valida consistencia
         │
         ▼
5. Consistency Validator
   → Recorre knowledge graph completo
   → Detecta contradicciones
   → Pide regeneración de nodos inconsistentes
         │
         ▼
6. Response
   → Timeline JSON completo con entidades conectadas
   → Streaming SSE para UI progresiva
```

---

## 5. Deployment Architecture

```
                    ┌─────────────┐
                    │   Vercel    │
                    │  (Edge +    │
                    │  Serverless)│
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
        ┌─────┴─────┐ ┌───┴───┐ ┌─────┴─────┐
        │  Neo4j    │ │Upstash│ │  LLM      │
        │  Aura     │ │ Redis │ │  APIs     │
        │  (Graph)  │ │(Cache)│ │ (External)│
        └───────────┘ └───────┘ └───────────┘
```

### Environment Variables

```env
# Database
NEO4J_URI=neo4j+s://xxx.databases.neo4j.io
NEO4J_USER=neo4j
NEO4J_PASSWORD=xxx

# Redis
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx

# LLM Providers
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-ant-xxx

# Auth
NEXTAUTH_SECRET=xxx
NEXTAUTH_URL=https://chronos.engine

# App
NODE_ENV=production
```

---

## 6. Project Structure

```
chronos-engine/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes
│   │   ├── (dashboard)/        # Main app routes
│   │   │   ├── timeline/
│   │   │   ├── explore/
│   │   │   └── map/
│   │   ├── api/                # API routes
│   │   │   ├── timelines/
│   │   │   ├── entities/
│   │   │   ├── simulate/
│   │   │   └── auth/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn primitives
│   │   ├── timeline/           # Timeline-specific
│   │   ├── map/                # Map visualizations
│   │   ├── entity/             # Entity cards/views
│   │   └── news/               # Newspaper layout
│   ├── lib/
│   │   ├── neo4j/              # Neo4j driver & queries
│   │   ├── ai/                 # LLM providers & chains
│   │   ├── simulation/         # Simulation engine
│   │   ├── cache/              # Redis caching
│   │   └── utils/              # Helpers
│   ├── schemas/                # Zod schemas
│   ├── types/                  # TypeScript types
│   └── hooks/                  # React hooks
├── prisma/                     # If using Prisma for relational data
├── docs/                       # Documentation
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── public/
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vitest.config.ts
└── package.json
```

---

## 7. Key Design Decisions

### 7.1 Why Neo4j over PostgreSQL?
El knowledge graph es el corazón del sistema. Las consultas de traversal (¿qué entidades están conectadas a esta?) son O(1) en Neo4j vs O(n) en SQL con JOINs. Para un sistema con millones de nodos y relaciones, esto es crítico.

### 7.2 Why Vercel AI SDK over LangChain?
Vercel AI SDK es más ligero, tiene mejor integración con Next.js (streaming, server components), y soporta 25+ providers. LangChain es más pesado y agrega overhead que no necesitamos para este caso de uso.

### 7.3 Why Serverless (Vercel)?
La naturaleza del producto es de uso esporádico (bursty). Un usuario genera un timeline, lo explora, y se va. Serverless escala a 0 y escala automáticamente con demanda. No necesitamos servidores 24/7.

### 7.4 Why Streaming SSE?
Las simulaciones pueden tomar 30-120 segundos. En vez de bloquear la UI, hacemos streaming de cada entidad/conforme se genera. El usuario ve la timeline construyéndose en tiempo real.

---

## 8. Scalability Considerations

| Componente | Estrategia |
|---|---|
| **Frontend** | Vercel Edge Network, ISR para páginas públicas |
| **API** | Serverless functions, auto-scaling |
| **Neo4j** | Aura Professional (up to 500K nodes), read replicas |
| **Redis** | Upstash, pay-per-request |
| **LLM** | Rate limiting + caching reduce llamadas API |
| **Queue** | BullMQ con Redis para simulaciones async |

---

## 9. Security Considerations

- Auth con NextAuth.js (OAuth + credentials)
- API rate limiting por usuario (token-based)
- Input validation con Zod en todas las entradas
- Neo4j queries parametrizadas (no string concatenation)
- Environment variables para secrets (nunca en código)
- CSP headers en Next.js config
- CORS configurado para production

---

## 10. Monitoring & Observability

| Capa | Herramienta |
|---|---|
| **APM** | Vercel Analytics |
| **Error Tracking** | Sentry |
| **Logging** | Structured JSON logs → Vercel Logs |
| **LLM Monitoring** | Custom event logging (model, tokens, cost, latency) |
| **Neo4j** | Aura monitoring dashboard |
| **Uptime** | Vercel Health Checks |
