# EP-07: World Map (Level 7)

**Epic ID:** EP-07  
**Priority:** P2 — Could Have  
**Sprint Target:** 8-9  
**Story Points:** 18

---

## Description

Genera un mapa mundial alternativo con fronteras, países, potencias y métricas modificadas según el timeline.

---

## User Stories

### US-07.1: Country Generation
**Points:** 3  
**As a** sistema  
**I need to** generar países alternativos con fronteras coherentes  
**So que** el mapa geopolítico tenga sentido

**Acceptance Criteria:**
- [ ] 15-30 países generados
- [ ] Nombre y ISO code únicos
- [ ] Año de formación coherente
- [ ] Tipo de gobierno
- [ ] Población y PIB estimados
- [ ] Nivel tecnológico asignado
- [ ] Vecinos, aliados y rivales definidos

**Technical Notes:**
- Schema: GeneratedCountrySchema
- ISO codes: 2 letters, unique
- Population/GDP must be realistic

---

### US-07.2: GeoJSON Generation
**Points:** 5  
**As a** sistema  
**I need to** generar datos GeoJSON para el mapa  
**So que** las fronteras se rendericen visualmente

**Acceptance Criteria:**
- [ ] GeoJSON válido con polygons para cada país
- [ ] Fronteras coherentes (sin gaps, sin overlaps)
- [ ] Países nuevos en ubicaciones lógicas
- [ ] Fronteras modificadas según eventos del timeline
- [ ] Propiedades GeoJSON incluyen metadata del país

**Technical Notes:**
- Use simplified world map as base
- Modify borders based on timeline events
- Generate new boundaries for new countries
- Validate geometry is valid

---

### US-07.3: Map Visualization
**Points:** 3  
**As a** usuario  
**I want to** ver el mapa mundial interactivo  
**So que** pueda explorar la geopolítica del timeline

**Acceptance Criteria:**
- [ ] Mapa renderizado con Leaflet/Mapbox
- [ ] Choropleth por métrica seleccionada
- [ ] Click en país abre detalle
- [ ] Zoom y pan funcionales
- [ ] Leyenda de colores visible
- [ ] Responsive

**Technical Notes:**
- Leaflet with GeoJSON layer
- Choropleth coloring per metric
- CountryDetail sidebar

---

### US-07.4: Choropleth Metrics
**Points:** 2  
**As a** usuario  
**I want to** cambiar la métrica del mapa  
**So que** pueda ver diferentes dimensiones del mundo

**Acceptance Criteria:**
- [ ] Métricas: GDP, population, technology level, government type
- [ ] Dropdown para seleccionar métrica
- [ ] Colores cambian según métrica
- [ ] Tooltip muestra valor al hover
- [ ] Transición suave entre métricas

---

### US-07.5: Country Detail Panel
**Points:** 2  
**As a** usuario  
**I want to** ver el detalle de un país al hacer click  
**So que** pueda explorar su información completa

**Acceptance Criteria:**
- [ ] Panel lateral con info del país
- [ ] Nombre, año de formación, gobierno
- [ ] Población, PIB, PIB per cápita
- [ ] Nivel tecnológico
- [ ] Empresas que operan en el país
- [ ] Aliados y rivales
- [ ] Historia del país

---

### US-07.6: Country Border Conflicts
**Points:** 3  
**As a** sistema  
**I need to** generar conflictos territoriales coherentes  
**So que** el mapa geopolítico sea interesante

**Acceptance Criteria:**
- [ ] Disputas territoriales entre países rivales
- [ ] Relaciones AT_WAR_WITH, ALLY_WITH, TRADE_WITH
- [ ] Conflictos causados por eventos del timeline
- [ ] Impacto en GDP y población de los países afectados

---

## Technical Dependencies

- EP-01 (Timeline)
- EP-02 (Companies — for country operations)
- Leaflet/Mapbox integration

## Risks

| Risk | Mitigation |
|---|---|
| GeoJSON generation too slow | Pre-generate base map, modify incrementally |
| Borders look unrealistic | Use real-world border patterns as reference |
| Performance with many countries | Simplify geometry, virtual rendering |
