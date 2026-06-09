# EP-05: Generated News (Level 5)

**Epic ID:** EP-05  
**Priority:** P1 — Should Have  
**Sprint Target:** 5-6  
**Story Points:** 12

---

## Description

Genera periódicos completos con artículos de noticias, headlines, fechas y autores, como si existieran realmente en el universo alternativo.

---

## User Stories

### US-05.1: Newspaper Article Generation
**Points:** 3  
**As a** sistema  
**I need to** generar artículos de periódico para eventos significativos del timeline  
**So que** el usuario pueda leer las noticias del mundo alternativo

**Acceptance Criteria:**
- [ ] 1-2 artículos por década para eventos high/critical
- [ ] Headline llamativo (10-150 chars)
- [ ] Subheadline opcional
- [ ] Cuerpo del artículo (200-2000 chars)
- [ ] Autor ficticio pero realista
- [ ] Fecha coherente con el evento
- [ ] Categoría del artículo

**Technical Notes:**
- Schema: GeneratedNewsArticleSchema
- Newspaper names generated procedurally
- Cross-reference entities from the timeline

---

### US-05.2: Newspaper Layout
**Points:** 3  
**As a** usuario  
**I want to** ver las noticias en formato periódico  
**So que** la experiencia se sienta inmersiva

**Acceptance Criteria:**
- [ ] Layout estilo periódico tradicional
- [ ] Nombre del periódico generado
- [ ] Fecha visible
- [ ] Headline grande y llamativo
- [ ] Cuerpo del artículo formateado
- [ ] "Also today" section con artículos relacionados
- [ ] Responsive en mobile

**Technical Notes:**
- NewspaperView component
- CSS Grid layout
- Print-friendly styles

---

### US-05.3: Newspaper Name Generation
**Points:** 2  
**As a** sistema  
**I need to** generar nombres de periódicos realistas  
**So que** cada timeline tenga sus propios medios

**Acceptance Criteria:**
- [ ] Patrón: "[Adjective] [City/Region] [Type]"
- [ ] Tipos: Times, Post, Herald, Tribune, Gazette, etc.
- [ ] 3-5 periódicos por timeline
- [ ] Nombres coherentes con la geografía del timeline
- [ ] consistentes a lo largo del timeline

---

### US-05.4: Article-Entity Linking
**Points:** 2  
**As a** sistema  
**I need to** linkar artículos con entidades mencionadas  
**So que** el usuario pueda navegar desde la noticia a la entidad

**Acceptance Criteria:**
- [ ] Cada artículo menciona 1-5 entidades
- [ ] Entidades linkadas: company, person, product, country
- [ ] Click en mención abre detalle de entidad
- [ ] Relación MENTIONED_IN entre artículo y entidad

---

### US-05.5: News Timeline View
**Points:** 2  
**As a** usuario  
**I want to** ver todas las noticias del timeline en orden cronológico  
**So que** pueda explorar la historia mediática

**Acceptance Criteria:**
- [ ] Lista cronológica de artículos
- [ ] Filtros: año, década, categoría, periódico
- [ ] Vista compacta (solo headlines) y expandida (con cuerpo)
- [ ] Click en artículo abre newspaper layout

---

## Technical Dependencies

- EP-01 (Timeline events)
- EP-02 (Companies — for mentions)
- EP-04 (People — for mentions)

## Risks

| Risk | Mitigation |
|---|---|
| Articles sound generic | Include specific details from timeline |
| Newspaper names sound fake | Use proven naming patterns |
| Entity references broken | Validate all mentions exist |
