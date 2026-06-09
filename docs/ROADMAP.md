# Chronos Engine — Development Roadmap

**Version:** 1.0  
**Date:** June 9, 2026

---

## Overview

5 fases de desarrollo, de MVP a producto completo. Cada fase tiene deliverables claros y criterios de aceptación.

---

## Fase 1: MVP (Semanas 1-6)

**Objetivo:** Generar timelines básicos con empresas y productos. API funcional.

### Semana 1-2: Project Setup & Foundation
- [ ] Initialize Next.js project con TypeScript
- [ ] Configurar Tailwind + shadcn/ui
- [ ] Configurar ESLint, Prettier, Vitest
- [ ] Setup Vercel AI SDK con OpenAI provider
- [ ] Configurar Neo4j driver + connection pooling
- [ ] Setup Redis (Upstash) client
- [ ] Auth básico con NextAuth.js (email + password)
- [ ] GitHub Actions CI/CD pipeline

### Semana 3-4: Core Generation Engine
- [ ] Divergence Parser: extraer año, tema, tipo del input del usuario
- [ ] Historical Context Builder: query Neo4j por contexto pre-divergencia
- [ ] Timeline Generator: LLM chain que genera eventos por década
- [ ] Company Generator: LLM structured output para empresas
- [ ] Product Generator: LLM structured output para productos
- [ ] Zod schemas para todos los outputs
- [ ] Basic consistency validation (sin L9 completo)

### Semana 5-6: API & Basic UI
- [ ] POST /api/timelines — crear nuevo timeline
- [ ] GET /api/timelines/:id — obtener timeline
- [ ] GET /api/timelines/:id/events — eventos del timeline
- [ ] GET /api/timelines/:id/entities — entidades del timeline
- [ ] Timeline Explorer UI (lista de eventos navegable)
- [ ] Entity Cards (empresas y productos)
- [ ] Loading states con streaming SSE
- [ ] Error handling y retry logic

### Deliverable Fase 1
- Usuario puede escribir "Internet en 1950" y ver una timeline con ~10 eventos, ~5 empresas y ~5 productos por década
- API REST funcional con documentación básica
- Deploy en Vercel

---

## Fase 2: Core Engine (Semanas 7-12)

**Objetivo:** Personas, noticias, Wikipedia alternativa. Knowledge Graph completo.

### Semana 7-8: People & News Generation
- [ ] Person Generator: biografías alternativas de personas reales
- [ ] News Generator: periódicos completos con artículos
- [ ] Newspaper UI component (layout estilo newspaper)
- [ ] Entity linking: personas conectadas a empresas y eventos
- [ ] Biographical consistency check

### Semana 9-10: Wikipedia & Knowledge Graph
- [ ] Wikipedia Article Generator: artículos de Wikipedia alternativa
- [ ] Wikipedia UI component (estilo Wikipedia real)
- [ ] Knowledge Graph schema completo en Neo4j
- [ ] Full CRUD para todos los nodos del grafo
- [ ] Relationship traversal queries
- [ ] Graph visualization básico

### Semana 11-12: Consistency Engine (L9 básico)
- [ ] Referential integrity check (entidad referenciada existe?)
- [ ] Temporal consistency check (evento después de divergencia?)
- [ ] Causal consistency check (efecto > causa?)
- [ ] Auto-regeneration de nodos inconsistentes
- [ ] Consistency score calculator
- [ ] Dashboard de consistencia

### Deliverable Fase 2
- Timeline completo con L1-L6 y L9 básico
- Knowledge Graph interconectado en Neo4j
- Score de consistencia visible

---

## Fase 3: Visual (Semanas 13-16)

**Objetivo:** Mapa mundial alternativo y simulación económica.

### Semana 13-14: World Map
- [ ] Country Generator: países alternativos con fronteras
- [ ] Map data generation (GeoJSON alternativo)
- [ ] Leaflet/Mapbox integration
- [ ] Choropleth map por métricas (población, PIB, tecnología)
- [ ] Fronteras dinámicas por año
- [ ] Click en país → detalle

### Semana 15-16: Economic Simulation
- [ ] Simplified IS-LM model por país
- [ ] Solow Growth model para largo plazo
- [ ] GDP, population, inflation, unemployment generators
- [ ] Economic Dashboard UI (Recharts)
- [ ] Comparación entre años
- [ ] Export de datos económicos (CSV/JSON)

### Deliverable Fase 3
- Mapa mundial interactivo con fronteras alternativas
- Dashboard económico por país y año
- Datos descargables

---

## Fase 4: Intelligence (Semanas 17-20)

**Objetivo:** Exploración temporal completa y consistencia avanzada.

### Semana 17-18: Temporal Exploration (L10)
- [ ] Year-by-year state snapshot del mundo
- [ ] Timeline slider interactivo
- [ ] Smooth transitions entre años
- [ ] Estado consistente en cada nodo temporal
- [ ] Comparación lado a lado de dos años
- [ ] "What changed" indicator entre años

### Semana 19-20: Advanced Consistency
- [ ] Cross-entity consistency (empresa X no puede tener CEO que no existe)
- [ ] Economic-event consistency (guerra ↓ GDP)
- [ ] Technology timeline consistency (no smartphones antes de computadoras)
- [ ] Graph anomaly detection
- [ ] Suggested fixes para inconsistencias
- [ ] Consistency report export

### Deliverable Fase 4
- Navegación temporal suave año por año
- Motor de consistencia avanzado (≥90% score)
- Experiencia de exploración tipo "Google Earth para realidades"

---

## Fase 5: Polish (Semanas 21-23)

**Objetivo:** UX, performance, testing, deployment final.

### Semana 21: UX Polish
- [ ] Onboarding flow para nuevos usuarios
- [ ] Share timelines (URL pública)
- [ ] Favoritos y historial de timelines
- [ ] Responsive design completo
- [ ] Dark mode
- [ ] Keyboard shortcuts

### Semana 22: Performance & Testing
- [ ] Performance audit (Lighthouse >90)
- [ ] Unit tests (>80% coverage)
- [ ] Integration tests con Neo4j testcontainers
- [ ] E2E tests con Playwright
- [ ] Load testing (1000+ concurrent timelines)
- [ ] LLM output validation tests

### Semana 23: Launch Prep
- [ ] Production monitoring (Sentry, Vercel Analytics)
- [ ] Rate limiting por tier de usuario
- [ ] Cost dashboard para LLM usage
- [ ] Documentation completa (README, API docs)
- [ ] Beta testing con 10 usuarios
- [ ] Landing page
- [ ] Social media assets

### Deliverable Fase 5
- Producto listo para producción
- Testing completo
- Deploy estable en Vercel
- Documentación completa

---

## Dependencies & Critical Path

```
Fase 1 (MVP) ──→ Fase 2 (Core) ──→ Fase 4 (Intelligence)
                      │
                      └──→ Fase 3 (Visual) ──┘
                                        │
                                   Fase 5 (Polish)
```

**Critical path:** Fase 1 → Fase 2 → Fase 4 → Fase 5

---

## Risk Timeline

| Semana | Riesgo | Probabilidad |
|---|---|---|
| 1-2 | Setup takes longer than expected | Media |
| 3-4 | LLM output quality insufficient | Alta |
| 5-6 | Neo4j integration complexity | Media |
| 9-10 | Knowledge graph schema instability | Alta |
| 13-14 | Map data generation too slow | Media |
| 17-18 | Temporal consistency very hard | Alta |

---

## Success Criteria per Phase

| Fase | Criterion | Metric |
|---|---|---|
| 1 | Timeline generable | 100% de inputs válidos producen output |
| 2 | Knowledge Graph funcional | ≥50 nodos por timeline, ≥90% conectados |
| 3 | Mapa visible | Mapa carga en <3s, fronteras coherentes |
| 4 | Exploración fluida | Transición año-año <1s |
| 5 | Listo para producción | Lighthouse >90, >80% test coverage |
