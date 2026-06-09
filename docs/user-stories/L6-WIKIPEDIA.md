# EP-06: Alternative Wikipedia (Level 6)

**Epic ID:** EP-06  
**Priority:** P1 — Should Have  
**Sprint Target:** 6-7  
**Story Points:** 12

---

## Description

Genera artículos de Wikipedia alternativa para países, guerras, inventos, empresas y personas. Artículos interconectados como en la Wikipedia real.

---

## User Stories

### US-06.1: Wikipedia Article Generation
**Points:** 3  
**As a** sistema  
**I need to** generar artículos de Wikipedia para todas las entidades del timeline  
**So que** exista una enciclopedia del universo alternativo

**Acceptance Criteria:**
- [ ] Artículos para: empresas, países, personas, tecnologías, eventos
- [ ] Formato estilo Wikipedia: título, introducción, secciones
- [ ] Contenido 200-1000 chars
- [ ] Referencias a otros artículos del mismo universo
- [ ] Categoría asignada
- [ ] Última edición timestamp

**Technical Notes:**
- Schema: WikiArticleSchema
- Generate after all entities are created
- Cross-reference extensively

---

### US-06.2: Wikipedia Layout
**Points:** 3  
**As a** usuario  
**I want to** ver artículos en formato Wikipedia  
**So que** la experiencia se sienta familiar y real

**Acceptance Criteria:**
- [ ] Layout estilo Wikipedia real
- [ ] Título, secciones con headers
- [ ] Links internos a otros artículos
- [ ] Sidebar con info-box
- [ ] Categorías al fondo
- [ ] "Ver también" section
- [ ] Responsive

**Technical Notes:**
- WikiView component
- Parse markdown-like content
- Render internal links as React Router links

---

### US-06.3: Wiki Interlinking
**Points:** 2  
**As a** sistema  
**I need to** crear referencias cruzadas entre artículos  
**So que** la wiki sea navegable como Wikipedia

**Acceptance Criteria:**
- [ ] Cada artículo referencia 2-5 otros artículos
- [ ] Links son internos (no rotos)
- [ ] Relación REFERENCES entre artículos
- [ ] No hayreferencias a entidades inexistentes

---

### US-06.4: Wiki Search & Browse
**Points:** 2  
**As a** usuario  
**I want to** buscar y navegar artículos de Wikipedia  
**So que** pueda explorar la enciclopedia

**Acceptance Criteria:**
- [ ] Búsqueda full-text por título y contenido
- [ ] Filtro por categoría (company, country, event, person, technology)
- [ ] Lista de todos los artículos
- [ ] Artículos relacionados en sidebar
- [ ] Random article button

---

### US-06.5: Wiki Statistics
**Points:** 2  
**As a** sistema  
**I need to** calcular estadísticas de la wiki generada  
**So que** el usuario vea el alcance del universo

**Acceptance Criteria:**
- [ ] Total de artículos
- [ ] Artículos por categoría
- [ ] Total de referencias internas
- [ ] Score de completitud (% de entidades con artículo)
- [ ] Display en dashboard del timeline

---

## Technical Dependencies

- EP-01-EP-05 (all entities must exist)
- Neo4j WikiArticle schema

## Risks

| Risk | Mitigation |
|---|---|
| Articles feel repetitive | Vary writing style per category |
| Broken internal links | Validate all references post-generation |
| Too many articles to generate | Prioritize by entity significance |
