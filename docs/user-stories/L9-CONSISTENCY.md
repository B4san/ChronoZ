# EP-09: Consistency Engine (Level 9)

**Epic ID:** EP-09  
**Priority:** P0 — Must Have  
**Sprint Target:** 3-4 (básico), 11-12 (avanzado)  
**Story Points:** 20

---

## Description

Motor de consistencia que detecta y resuelve contradicciones en el knowledge graph. Asegura que cada entidad referenciada exista, que las fechas sean coherentes, y que las cadenas causales tengan sentido.

---

## User Stories

### US-09.1: Referential Integrity Check
**Points:** 3  
**As a** sistema  
**I need to** verificar que toda referencia a una entidad sea válida  
**So que** no existan entidades fantasma en el timeline

**Acceptance Criteria:**
- [ ] Cada referencia a company/person/product/country/technology verificada
- [ ] Entidades referenciadas que no existen → flagged
- [ ] Reporte de inconsistencias generado
- [ ] Score de consistencia calculado
- [ ] Auto-fix: crear entidad placeholder si falta

**Technical Notes:**
- Cypher query: MATCH (a)-[r]->(b) WHERE NOT EXISTS { MATCH (other {Id: b.Id}) }
- Run after each generation phase
- Consistency score = validRefs / totalRefs

---

### US-09.2: Temporal Consistency Check
**Points:** 3  
**As a** sistema  
**I need to** verificar que las fechas sean temporalmente coherentes  
**So que** no existan paradoxos temporales

**Acceptance Criteria:**
- [ ] Eventos causales: causa siempre anterior a efecto
- [ ] Empresa fundada después de su evento causal
- [ ] Producto lanzado después de su tecnología habilitadora
- [ ] Persona nacida antes de sus logros
- [ ] País formado antes de sus eventos
- [ ] Todos los eventos >= divergenceYear

**Technical Notes:**
- Cypher query: MATCH (predecessor:Event)-[:CAUSED_BY]->(successor:Event) WHERE predecessor.year > successor.year
- Validate against divergence year
- Flag temporal violations

---

### US-09.3: Causal Consistency Check
**Points:** 3  
**As a** sistema  
**I need to** verificar que las cadenas causales tengan sentido  
**So que** la historia sea lógica

**Acceptance Criteria:**
- [ ] Cada evento tiene al menos 1 causa (excepto divergencia directa)
- [ ] Causality strength coherente con la relación
- [ ] No hay eventos "flotantes" sin conexión causal
- [ ] Efectos escalonados (no todos instantáneos)
- [ ] Magnitud del efecto proporcional a la causa

---

### US-09.4: Economic Consistency Check
**Points:** 2  
**As a** sistema  
**I need to** verificar que los datos económicos sean coherentes  
**So que** no existan economías imposibles

**Acceptance Criteria:**
- [ ] GDP positivo para países activos
- [ ] Inflation en rango [-5%, 50%]
- [ ] Unemployment en rango [0%, 50%]
- [ ] Population creciente o estable (sin saltos)
- [ ] PIB per cápita coherente con GDP y población
- [ ] Guerra → GDP negativo temporal

---

### US-09.5: Consistency Score Dashboard
**Points:** 2  
**As a** usuario  
**I want to** ver el score de consistencia de mi timeline  
**So que** sepa qué tan confiable es

**Acceptance Criteria:**
- [ ] Score global (0-100%)
- [ ] Score por categoría (temporal, referential, causal, economic)
- [ ] Lista de issues con severidad
- [ ] Sugerencias de fix
- [ ] Botón para auto-fix
- [ ] Visual: gauge chart

---

### US-09.6: Auto-Fix Engine
**Points:** 3  
**As a** sistema  
**I need to** corregir automáticamente inconsistencias menores  
**So que** el timeline sea usable sin intervención manual

**Acceptance Criteria:**
- [ ] Entidades faltantes: crear con datos placeholder
- [ ] Fechas inconsistentes: ajustar al rango válido
- [ ] Referencias rotas: apuntar a entidad más cercana
- [ ] Log de cada fix aplicado
- [ ] Score mejora post-fix
- [ ] Fixes reversibles

---

### US-09.7: Consistency Report Export
**Points:** 1  
**As a** usuario  
**I want to** exportar el reporte de consistencia  
**So que** pueda revisarlo fuera de la app

**Acceptance Criteria:**
- [ ] Export en formato JSON
- [ ] Incluye: score, issues, fixes, entities affected
- [ ] Timestamp de validación
- [ ] Download button en UI

---

## Technical Dependencies

- EP-01 through EP-08 (all entities)
- Neo4j for graph queries

## Risks

| Risk | Mitigation |
|---|---|
| Checks too slow for large timelines | Run incrementally, not all at once |
| Auto-fix creates worse issues | Validate fix before applying |
| Too many false positives | Tune thresholds, human review for edge cases |
