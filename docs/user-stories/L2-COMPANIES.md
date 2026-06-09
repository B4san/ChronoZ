# EP-02: Alternative Companies (Level 2)

**Epic ID:** EP-02  
**Priority:** P0 — Must Have  
**Sprint Target:** 2-3  
**Story Points:** 15

---

## Description

Genera empresas alternativas ficticias pero realistas para cada década del timeline. Cada empresa tiene nombre, CEO, fundación, valoración, industria e historia coherente con la realidad alternativa.

---

## User Stories

### US-02.1: Company Generation per Decade
**Points:** 3  
**As a** sistema  
**I need to** generar 2-5 empresas por década coherentes con el timeline  
**So that** el mundo alternativo tenga actores económicos creíbles

**Acceptance Criteria:**
- [ ] 2-5 empresas generadas por década
- [ ] Nombres realistas para la era e industria
- [ ] CEO con nombre y background
- [ ] Fundación en año coherente con la década
- [ ] Valoración realista para la industria/época
- [ ] Status coherente (startup → growing → established)

**Technical Notes:**
- Use GPT-4o for entity generation
- Schema: GeneratedCompanySchema
- Include previous companies in prompt to avoid duplicates
- Markov chain names for variety

---

### US-02.2: Company-Event Linking
**Points:** 3  
**As a** sistema  
**I need to** linkar cada empresa con los eventos que la causaron o afectaron  
**So that** exista una cadena causal clara

**Acceptance Criteria:**
- [ ] Cada empresa tiene al menos 1 evento causal
- [ ] Relación LED_TO entre evento y empresa
- [ ] Relación FOUNDED_BY entre empresa y persona
- [ ] Año de fundación coherente con timeline
- [ ] Industria coherente con nivel tecnológico del timeline

---

### US-02.3: Company Detail View
**Points:** 2  
**As a** usuario  
**I want to** ver el detalle de una empresa generada  
**So that** pueda explorar su historia y conexiones

**Acceptance Criteria:**
- [ ] Card muestra: nombre, fundación, HQ, industria, valoración, CEO
- [ ] Timeline de eventos de la empresa
- [ ] Productos que produce
- [ ] Competidores
- [ ] País de operación
- [ ] Click en CEO abre su biografía

**Technical Notes:**
- EntityCard component (company variant)
- EntityDetail component
- Query related entities via Neo4j

---

### US-02.4: Company Network Visualization
**Points:** 3  
**As a** usuario  
**I want to** ver las relaciones entre empresas  
**So that** entienda el ecosistema empresarial del timeline

**Acceptance Criteria:**
- [ ] Grafo de relaciones visualizado
- [ ] Nodos: empresas, personas, productos
- [ ] Relaciones mostradas como edges
- [ ] Click en nodo muestra detalle
- [ ] Zoom y pan en el grafo
- [ ] Layout force-directed

**Technical Notes:**
- D3.js force-directed graph
- EntityNetwork component
- Limit to 50 nodes for performance

---

### US-02.5: Company Search & Filter
**Points:** 2  
**As a** usuario  
**I want to** buscar y filtrar empresas  
**So that** pueda encontrar rápidamente lo que busco

**Acceptance Criteria:**
- [ ] Búsqueda por nombre (full-text)
- [ ] Filtro por década de fundación
- [ ] Filtro por industria
- [ ] Filtro por país
- [ ] Ordenamiento por valoración, nombre, año

---

### US-02.6: Company Persistence
**Points:** 2  
**As a** sistema  
**I need to** persistir empresas en el knowledge graph  
**So that** estén disponibles para consultas y navegación

**Acceptance Criteria:**
- [ ] Company node creado en Neo4j
- [ ] Relaciones: PART_OF.timeline, OPERATES_IN.country
- [ ] Index en company.name, company.foundedYear
- [ ] Company ID único generado

---

## Technical Dependencies

- EP-01 (Timeline generation working)
- Neo4j company schema defined

## Risks

| Risk | Mitigation |
|---|---|
| Company names sound fake | Train Markov chain on real company names per era |
| Valuations unrealistic | Include reference ranges in prompt |
| Too many/too few companies | Dynamic count based on timeline magnitude |
