# EP-03: Alternative Products (Level 3)

**Epic ID:** EP-03  
**Priority:** P0 — Must Have  
**Sprint Target:** 3  
**Story Points:** 12

---

## Description

Genera productos alternativos coherentes con la línea tecnológica del timeline. Dispositivos, vehículos, medicinas, software, etc.

---

## User Stories

### US-03.1: Product Generation per Decade
**Points:** 3  
**As a** sistema  
**I need to** generar 2-4 productos por década coherentes con la tecnología del timeline  
**So that** el mundo alternativo tenga productos tangibles

**Acceptance Criteria:**
- [ ] 2-4 productos por década
- [ ] Nombre catchy y era-appropriate
- [ ] Categoría: communication, computing, transportation, medicine, entertainment, energy
- [ ] Año de lanzamiento coherente
- [ ] Precio en USD realista para la época
- [ ] Manufacturer vinculado a empresa existente
- [ ] Especificaciones clave (key-value pairs)

**Technical Notes:**
- Schema: GeneratedProductSchema
- Ensure manufacturer exists in the timeline
- Technology level must be achievable

---

### US-03.2: Product-Technology Linking
**Points:** 2  
**As a** sistema  
**I need to** linkar cada producto con las tecnologías que lo habilitan  
**So that** exista una progresión tecnológica lógica

**Acceptance Criteria:**
- [ ] Cada producto usa al menos 1 tecnología
- [ ] La tecnología debe existir previamente en el timeline
- [ ] Si la tecnología no existe, se crea automáticamente
- [ ] Relación USES_TECHNOLOGY entre producto y tecnología

---

### US-03.3: Product Evolution Chain
**Points:** 2  
**As a** sistema  
**I need to** generar sucesores/predecesores de productos  
**So que** exista una evolución de producto coherente

**Acceptance Criteria:**
- [ ] Cada producto puede tener predecesor
- [ ] Cada producto puede tener sucesor
- [ ] Relaciones PREDECESSOR_OF y SUCCEEDED_BY
- [ ] Evolución lógica (mejora en specs, precio bajó, etc.)

---

### US-03.4: Product Detail View
**Points:** 2  
**As a** usuario  
**I want to** ver el detalle de un producto alternativo  
**So que** pueda explorar su especificaciones y historia

**Acceptance Criteria:**
- [ ] Card muestra: nombre, categoría, año, precio, impacto
- [ ] Especificaciones en formato key-value
- [ ] Manufacturer linkado
- [ ] Tecnologías que usa
- [ ] Evolución (predecesor/sucesor)
- [ ] Impact assessment (minor/moderate/significant/revolutionary)

---

### US-03.5: Product Grid View
**Points:** 2  
**As a** usuario  
**I want to** ver todos los productos del timeline en un grid  
**So que** pueda comparar y explorar

**Acceptance Criteria:**
- [ ] Grid responsive de productos
- [ ] Filtros: categoría, década, precio, impacto
- [ ] Ordenamiento: nombre, año, precio, impacto
- [ ] Click en producto abre detalle
- [ ] Indicador visual de impacto (color coding)

---

## Technical Dependencies

- EP-01 (Timeline)
- EP-02 (Companies — for manufacturer linking)

## Risks

| Risk | Mitigation |
|---|---|
| Products feel generic | Include specific, creative details in prompt |
| Prices unrealistic | Reference historical price ranges per era |
| Technology chain broken | Validate technology exists before product |
