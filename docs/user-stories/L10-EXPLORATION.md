# EP-10: Temporal Exploration (Level 10)

**Epic ID:** EP-10  
**Priority:** P2 — Could Have  
**Sprint Target:** 11-12  
**Story Points:** 15

---

## Description

Navegación temporal año por año con estado del mundo en cada punto. Como Google Earth pero para realidades alternativas.

---

## User Stories

### US-10.1: Year-by-Year State Snapshot
**Points:** 5  
**As a** sistema  
**I need to** generar el estado completo del mundo para cada año  
**So que** el usuario pueda navegar año por año

**Acceptance Criteria:**
- [ ] Para cada año: eventos, empresas activas, personas vivas, tecnología disponible, economía
- [ ] Snapshot consistente con el timeline
- [ ] Estado acumulativo (cada año incluye todo lo anterior)
- [ ] Persistido en cache para acceso rápido
- [ ] Response time <1s por año

**Technical Notes:**
- Pre-compute snapshots after timeline generation
- Cache in Redis with year as key
- Neo4j queries with temporal filters

---

### US-10.2: Timeline Slider
**Points:** 3  
**As a** usuario  
**I want to** navegar entre años con un slider  
**So que** pueda moverme fluidamente en el tiempo

**Acceptance Criteria:**
- [ ] Slider horizontal con rango de años
- [ ]拖动 shows preview del año
- [ ] Soltar actualiza la vista completa
- [ ] Botones de decade jump (±10 años)
- [ ] Año actual visible
- [ ] Keyboard arrows para navegar
- [ ] Smooth animation al cambiar

**Technical Notes:**
- TimelineSlider component
- Debounced updates (200ms)
- Pre-fetch adjacent years

---

### US-10.3: Year Comparison
**Points:** 3  
**As a** usuario  
**I want to** comparar dos años lado a lado  
**So que** pueda ver exactamente qué cambió

**Acceptance Criteria:**
- [ ] Split view con dos años
- [ ] Highlight de cambios (nuevos, eliminados, modificados)
- [ ] "What changed" indicator
- [ ] Delta de métricas económicas
- [ ] Nuevos eventos entre los años
- [ ] Entidades que aparecieron/desaparecieron

---

### US-10.4: "What Changed" Diff Engine
**Points:** 2  
**As a** sistema  
**I need to** calcular las diferencias entre dos años  
**So que** el usuario vea solo los cambios

**Acceptance Criteria:**
- [ ] Diff de eventos (nuevos, modificados)
- [ ] Diff de empresas (nuevas, status cambiado, desaparecidas)
- [ ] Diff de tecnología (nuevas, maduradas)
- [ ] Diff de países (nuevos, fronteras cambiadas)
- [ ] Diff económico (cambios en métricas)
- [ ] Resumen de diff en texto natural

---

### US-10.5: Temporal Dashboard
**Points:** 2  
**As a** usuario  
**I want to** ver un dashboard del estado del mundo en un año  
**So que** tenga una visión completa del momento

**Acceptance Criteria:**
- [ ] Resumen del año: eventos principales
- [ ] Top empresas por valoración
- [ ] Mapa mini del mundo
- [ ] Indicadores económicos clave
- [ ] Tecnologías disponibles
- [ ] Personas más significativas
- [ ] "Also happening" con noticias del año

---

## Technical Dependencies

- EP-01 through EP-09 (all previous levels)
- Redis for snapshot caching

## Risks

| Risk | Mitigation |
|---|---|
| Too many snapshots to pre-compute | Lazy computation + caching |
| Slider feels laggy | Debounce + pre-fetch adjacent years |
| Comparison too complex | Start with simple diff, iterate |
