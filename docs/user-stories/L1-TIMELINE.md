# EP-01: Procedural Timeline (Level 1)

**Epic ID:** EP-01  
**Priority:** P0 — Must Have  
**Sprint Target:** 1-2  
**Story Points:** 21

---

## Description

Genera una línea temporal navegable a partir de un punto de divergencia introducido por el usuario. La IA genera eventos proceduralmente cada década desde el punto de divergencia.

---

## User Stories

### US-01.1: Input del Divergence Point
**Points:** 3  
**As a** usuario  
**I want to** escribir un escenario de divergencia en texto libre  
**So that** el sistema pueda generar un timeline basado en mi idea

**Acceptance Criteria:**
- [ ] Input de texto libre acepta entre 10 y 500 caracteres
- [ ] Validación en client-side y server-side
- [ ] Muestra ejemplos de divergencias predefinidos
- [ ] Botón "GO" envía la solicitud
- [ ] Loading state mientras se procesa

**Technical Notes:**
- Zod schema validation
- POST /api/v1/timelines
- Sanitize input before sending to LLM

---

### US-01.2: Divergence Parser
**Points:** 3  
**As a** sistema  
**I need to** parsear el input del usuario en un DivergencePoint estructurado  
**So that** el motor de simulación pueda procesarlo

**Acceptance Criteria:**
- [ ] Extrae año de divergencia (o infiere uno razonable)
- [ ] Identifica el tema principal
- [ ] Clasifica el tipo (technology, politics, economics, etc.)
- [ ] Determina la magnitud del cambio
- [ ] Retorna DivergenceInput schema válido

**Technical Notes:**
- Use GPT-4o-mini for cost efficiency
- Structured output con Zod schema
- Fallback: ask user for clarification if parsing fails

---

### US-01.3: Timeline Generation Engine
**Points:** 5  
**As a** sistema  
**I need to** generar eventos para cada década desde el punto de divergencia  
**So that** se construya un timeline completo y coherente

**Acceptance Criteria:**
- [ ] Genera 3-8 eventos por década
- [ ] Cada evento tiene: year, title, description, category, impact
- [ ] Los eventos son causalmente conectados
- [ ] La progresión temporal es lógica
- [ ] El contenido es coherente con el punto de divergencia

**Technical Notes:**
- Use Claude Sonnet for timeline generation
- Chain of thought: generate decade by decade with context
- Each decade receives previous decades as context
- Streaming SSE para progreso en tiempo real

---

### US-01.4: Event Category Classification
**Points:** 2  
**As a** sistema  
**I need to** clasificar cada evento en categorías predefinidas  
**So that** el usuario pueda filtrar por tipo de evento

**Acceptance Categories:**
- [ ] Categorías: technology, politics, economics, culture, science, military
- [ ] Cada evento tiene exactamente una categoría
- [ ] Impact level clasificado: low, medium, high, critical
- [ ] Causality strength (0-1) asignado

---

### US-01.5: Knowledge Graph Persistence
**Points:** 3  
**As a** sistema  
**I need to** persistir el timeline generado en Neo4j  
**So that** el usuario pueda consultarlo después

**Acceptance Criteria:**
- [ ] Timeline node creado con metadata
- [ ] DivergencePoint node creado y linkado
- [ ] Cada evento creado como node
- [ ] Relaciones CONTAINS_EVENT creadas
- [ ] Relaciones causales (CAUSED_BY) entre eventos
- [ ] IDs únicos generados para cada nodo

**Technical Notes:**
- Use Neo4j driver with managed transactions
- Batch create events for performance
- Index on timeline.Id, event.year

---

### US-01.6: Streaming Response
**Points:** 3  
**As a** usuario  
**I want to** ver los eventos generándose en tiempo real  
**So that** no tengo que esperar 30 segundos sin retroalimentación

**Acceptance Criteria:**
- [ ] SSE stream connection established
- [ ] Phase events (parsing, generating, validating) shown
- [ ] Events appear as they're generated
- [ ] Loading indicator shows current phase
- [ ] Stream closes on completion or error
- [ ] UI updates smoothly without jank

**Technical Notes:**
- ReadableStream with TextEncoder
- EventSource on client side
- Progressive rendering of events

---

### US-01.7: Timeline Explorer UI
**Points:** 2  
**As a** usuario  
**I want to** ver mi timeline en una interfaz navegable  
**So that** pueda explorar los eventos generados

**Acceptance Criteria:**
- [ ] Timeline vertical con eventos ordenados por año
- [ ] Cada evento muestra: título, año, categoría, impacto
- [ ] Click en evento muestra detalle completo
- [ ] Filtros por década y categoría
- [ ] Resumen del timeline en la parte superior
- [ ] Score de consistencia visible

**Technical Notes:**
- TimelineExplorer component
- EventCard component
- FilterBar component
- ConsistencyBadge component

---

### US-01.8: Timeline CRUD
**Points:** 2  
**As a** usuario  
**I want to** guardar, ver y eliminar mis timelines  
**So that** pueda administrar mis simulaciones

**Acceptance Criteria:**
- [ ] Lista de timelines del usuario en "My Timelines"
- [ ] Cada timeline muestra: nombre, fecha, status, score
- [ ] Click para abrir timeline existente
- [ ] Botón para eliminar con confirmación
- [ ] Botón para regenerar timeline

---

## Technical Dependencies

- Neo4j driver configured
- Vercel AI SDK configured
- Auth system working (EP-11)
- Zod schemas defined (DATA-MODELS.md)

## Risks

| Risk | Mitigation |
|---|---|
| LLM output quality inconsistent | Retry + validation + fallback prompts |
| Generation too slow | Streaming SSE + caching |
| Events not causally connected | Explicit causal chain prompt engineering |
