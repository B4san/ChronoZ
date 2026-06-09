# ChronoZ — Chronos Engine

**Motor Procedural de Civilizaciones Alternativas**

Un motor de simulación de realidades alternativas que genera civilizaciones completas, coherentes y navegables a partir de un único punto de divergencia histórica.

---

## ¿Qué es Chronos Engine?

No es un generador de historias. Es un **motor procedural de civilizaciones alternativas**.

Dado un punto de divergencia como "Internet inventado en 1950" o "Tesla nunca existió", el sistema construye un árbol de conocimiento conectado donde cada entidad existe en relación causal con las demás.

---

## Niveles de Generación

| Nivel | Descripción | Status |
|---|---|---|
| **L1** | Timeline Procedural — Eventos por década | 📋 Planificado |
| **L2** | Empresas Alternativas — Names, CEOs, valuation | 📋 Planificado |
| **L3** | Productos Alternativos — Dispositivos, vehículos | 📋 Planificado |
| **L4** | Personas Alternativas — Biografías modificadas | 📋 Planificado |
| **L5** | Noticias Generadas — Periódicos completos | 📋 Planificado |
| **L6** | Wikipedia Alternativa — Artículos interconectados | 📋 Planificado |
| **L7** | Mapa Mundial — Fronteras, países modificados | 📋 Planificado |
| **L8** | Simulación Económica — PIB, población, inflación | 📋 Planificado |
| **L9** | Motor de Consistencia — Knowledge Graph validado | 📋 Planificado |
| **L10** | Exploración Temporal — Navegación año por año | 📋 Planificado |

---

## Tech Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14+, React 18, TypeScript |
| UI | shadcn/ui, Tailwind CSS |
| Visualización | D3.js, Leaflet, Recharts |
| Graph DB | Neo4j 5.x (Aura) |
| Cache | Redis (Upstash) |
| LLM | Vercel AI SDK (multi-provider) |
| Auth | NextAuth.js v5 |
| Testing | Vitest, Playwright |
| Deploy | Vercel |

---

## Documentación

Toda la documentación del proyecto se encuentra en [`docs/`](docs/):

### Documentos Principales
- [PRD — Product Requirements Document](docs/PRD.md)
- [Architecture — Technical Architecture](docs/ARCHITECTURE.md)
- [Roadmap — Development Roadmap](docs/ROADMAP.md)
- [Knowledge Graph Schema](docs/KNOWLEDGE-GRAPH.md)
- [AI Strategy — LLM Integration](docs/AI-STRATEGY.md)
- [API Design](docs/API.md)
- [Data Models — TypeScript Interfaces](docs/DATA-MODELS.md)
- [UI/UX Design](docs/UI-UX.md)
- [Security & Auth](docs/SECURITY.md)
- [Cost Model](docs/COST-MODEL.md)
- [Testing Strategy](docs/TESTING.md)

### User Stories
- [Epics & Backlog](docs/user-stories/EPICS.md)
- [L1 — Timeline](docs/user-stories/L1-TIMELINE.md)
- [L2 — Companies](docs/user-stories/L2-COMPANIES.md)
- [L3 — Products](docs/user-stories/L3-PRODUCTS.md)
- [L4 — People](docs/user-stories/L4-PEOPLE.md)
- [L5 — News](docs/user-stories/L5-NEWS.md)
- [L6 — Wikipedia](docs/user-stories/L6-WIKIPEDIA.md)
- [L7 — Map](docs/user-stories/L7-MAP.md)
- [L8 — Economics](docs/user-stories/L8-ECONOMICS.md)
- [L9 — Consistency](docs/user-stories/L9-CONSISTENCY.md)
- [L10 — Exploration](docs/user-stories/L10-EXPLORATION.md)

---

## Getting Started

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm run test

# Build para producción
npm run build
```

---

## Ejemplos de Escenarios

- "¿Qué habría pasado si Leonardo Da Vinci tuviera acceso a computadoras?"
- "¿Y si el Imperio Romano descubre la electricidad?"
- "¿Y si las IA aparecen en 1900?"
- "¿Y si nunca se inventa el petróleo?"
- "Internet inventado en 1950"
- "Tesla nunca existió"
- "La energía nuclear se vuelve barata en 1980"
- "Los dinosaurios nunca se extinguen"

---

## License

ISC
