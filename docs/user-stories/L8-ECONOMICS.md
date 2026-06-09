# EP-08: Economic Simulation (Level 8)

**Epic ID:** EP-08  
**Priority:** P2 — Could Have  
**Sprint Target:** 9-10  
**Story Points:** 15

---

## Description

Genera datos económicos simulados (PIB, población, inflación, desempleo) por país y año, usando modelos macroeconómicos simplificados.

---

## User Stories

### US-08.1: Economic Model Implementation
**Points:** 5  
**As a** sistema  
**I need to** implementar modelos macroeconómicos simplificados  
**So que** los datos económicos sean realistas y coherentes

**Acceptance Criteria:**
- [ ] IS-LM model simplificado por país
- [ ] Solow Growth model para largo plazo
- [ ] Phillips Curve para inflación-desempleo
- [ ] Model calibrado para cada nivel tecnológico
- [ ] Output: GDP, GDP growth, inflation, unemployment, population
- [ ] Datos coherentes con eventos del timeline

**Technical Notes:**
- Implement in TypeScript, pure functions
- Each country has initial conditions
- Events modify parameters (war → GDP drops, tech boom → growth increases)
- Year-by-year simulation

---

### US-08.2: Economic Snapshot Generation
**Points:** 3  
**As a** sistema  
**I need to** generar snapshots económicos para cada país/año  
**So que** exista una base de datos económica completa

**Acceptance Criteria:**
- [ ] Snapshot por país por año (1950-2050 = 100 years × 25 countries = 2500 snapshots)
- [ ] Campos: GDP, growth, inflation, unemployment, population, Gini, literacy, life expectancy
- [ ] Valores dentro de rangos realistas
- [ ] Tendencias coherentes con eventos del timeline
- [ ] Persistidos en Neo4j

**Technical Notes:**
- Use GPT-4o-mini for bulk generation (cheapest model)
- Batch generation: 10 countries per call
- Validate ranges post-generation

---

### US-08.3: Economics Dashboard
**Points:** 3  
**As a** usuario  
**I want to** ver gráficos de datos económicos  
**So que** pueda entender la economía del timeline

**Acceptance Criteria:**
- [ ] Dashboard por país con gráficos
- [ ] GDP growth line chart
- [ ] Inflation vs unemployment scatter
- [ ] Population bar chart
- [ ] Key indicators summary
- [ ] Selector de año
- [ ] Comparación entre países

**Technical Notes:**
- Recharts library
- EconomicsDashboard component
- Responsive charts

---

### US-08.4: Economic Comparison Tool
**Points:** 2  
**As a** usuario  
**I want a** comparar la economía entre dos años  
**So que** pueda ver cómo cambió el mundo

**Acceptance Criteria:**
- [ ] Selector de dos años
- [ ] Delta indicators (growth ↑, inflation ↓)
- [ ] Top movers (más cambiaron)
- [ ] Chart overlay de ambos años
- [ ] Export de datos (CSV/JSON)

---

### US-08.5: Event-Economic Impact
**Points:** 2  
**As a** sistema  
**I need to** modelar el impacto de eventos en la economía  
**So que** los datos económicos reflejen los eventos

**Acceptance Criteria:**
- [ ] Eventos high/critical impact modify economic parameters
- [ ] War → GDP drops 10-30%, unemployment rises
- [ ] Technology breakthrough → GDP growth +2-5%
- [ ] Political stability → investment increases
- [ ] Effects have delays (not instantaneous)
- [ ] Cascading effects between countries (trade)

---

## Technical Dependencies

- EP-01 (Timeline events)
- EP-07 (Countries)
- Recharts library

## Risks

| Risk | Mitigation |
|---|---|
| Economic data unrealistic | Calibrate with real-world ranges |
| Too many snapshots to generate | Use cheap model, batch generation |
| Models too complex | Start with simplified, iterate |
