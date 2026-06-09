# EP-04: Alternative People (Level 4)

**Epic ID:** EP-04  
**Priority:** P1 — Should Have  
**Sprint Target:** 4-5  
**Story Points:** 15

---

## Description

Genera biografías alternativas de personas reales (Einstein, Tesla, Jobs, Turing) o personas ficticias, coherentes con el punto de divergencia.

---

## User Stories

### US-04.1: Real Person Reimagining
**Points:** 5  
**As a** sistema  
**I need to** reimaginar la biografía de personas reales en el timeline alternativo  
**So que** el usuario vea cómo sus vidas habrían sido diferentes

**Acceptance Criteria:**
- [ ] Lista de personas reales relevantes para el timeline
- [ ] Cada persona tiene: nombre, biografía alternativa, destino alternativo
- [ ] Biografía coherente con el punto de divergencia
- [ ] Logros diferentes a la vida real
- [ ] Conexiones con empresas/eventos del timeline
- [ ] Significance level: low/medium/high/legendary

**Technical Notes:**
- Use Claude Sonnet for biographical generation
- Include real-world equivalent reference
- Cross-reference with existing timeline entities

---

### US-04.2: Fictional Person Generation
**Points:** 3  
**As a** sistema  
**I need to** generar personas ficticias para el timeline  
**So que** el mundo tenga personajes propios

**Acceptance Criteria:**
- [ ] 3-5 personas ficticias por década relevante
- [ ] Nombre culturalmente apropiado
- [ ] Biografía coherente con su rol
- [ ] Conexiones con empresas/eventos existentes
- [ ] Nacionalidad coherente con países del timeline

---

### US-04.3: Person-Entity Linking
**Points:** 2  
**As a** sistema  
**I need to** linkar personas con empresas, eventos y productos  
**So que** exista una red de relaciones completa

**Acceptance Criteria:**
- [ ] FOUNDED_BY: persona → empresa
- [ ] WORKS_FOR: persona → empresa
- [ ] CREATED: persona → tecnología
- [ ] MENTORED_BY: persona → persona
- [ ] BORN_IN: persona → país
- [ ] Cada persona tiene al menos 2 conexiones

---

### US-04.4: Person Detail View
**Points:** 2  
**As a** usuario  
**I want to** ver la biografía completa de una persona alternativa  
**So que** pueda explorar su historia alternativa

**Acceptance Criteria:**
- [ ] Card muestra: nombre, años de vida, nacionalidad, ocupación
- [ ] Biografía completa (500 chars max)
- [ ] Lista de logros
- [ ] "Alternate fate" section comparando con la vida real
- [ ] Real world equivalent link (si aplica)
- [ ] Timeline de eventos relacionados

---

### US-04.5: Historical Figures Database
**Points:** 2  
**As a** sistema  
**I need to** tener una base de datos de figuras históricas relevantes  
**So que** el sistema sepa quiénes reimaginar

**Acceptance Criteria:**
- [ ] Lista predefinida de ~50 figuras históricas relevantes
- [ ] Categorías: science, technology, politics, culture, economics
- [ ] Dato: año de nacimiento real, campo, nacionalidad
- [ ] El sistema selecciona las relevantes para cada timeline

---

### US-04.6: Person Search
**Points:** 1  
**As a** usuario  
**I want to** buscar personas por nombre, ocupación o país  
**So que** pueda encontrar rápidamente

**Acceptance Criteria:**
- [ ] Búsqueda por nombre (full-text)
- [ ] Filtro por ocupación
- [ ] Filtro por país de origen
- [ ] Filtro por significance level
- [ ] Ordenamiento por año de nacimiento, significance

---

## Technical Dependencies

- EP-01 (Timeline)
- EP-02 (Companies — for linking)
- Historical figures database (seed data)

## Risks

| Risk | Mitigation |
|---|---|
| Biographies feel generic | Include specific, personal details |
| Person doesn't fit the timeline | Validate against divergence point |
| Too many/too few people | Dynamic count based on timeline relevance |
