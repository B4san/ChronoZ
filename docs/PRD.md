# Chronos Engine — Product Requirements Document

**Version:** 1.0  
**Date:** June 9, 2026  
**Author:** Sebastian Flores Peralta  
**Status:** Draft

---

## 1. Vision

Chronos Engine es un motor de simulación de realidades alternativas que genera civilizaciones completas, coherentes y navegables a partir de un único punto de divergencia histórica.

No es un generador de historias. Es un **motor procedural de civilizaciones alternativas**.

---

## 2. Problema

Los generadores de historias alternativas existentes (ChatGPT con prompts, AlterTimeline, etc.) producen texto suelto sin consistencia interna. No construyen mundos — narran fragmentos. No hay conexiones entre eventos, empresas, personas o tecnologías. Cada generación es una isla sin relación con la anterior.

---

## 3. Solución

Un sistema que, dado un punto de divergencia ("Internet inventado en 1950"), construya un árbol de conocimiento conectado donde cada entidad (empresa, persona, tecnología, país) existe en relación causal con las demás. El usuario puede navegar el mundo generado como exploraría Google Earth, pero para realidades alternativas.

---

## 4. Target Users

| Segmento | Descripción | Dolor |
|---|---|---|
| **Educadores/Estudiantes** | Profesores y alumnos de historia | Quieren explorar "¿qué habría pasado si...?" de forma estructurada |
| **Escritores/Creadores** | Autores de ficción especulativa | Necesitan mundos consistentes como base para sus historias |
| **Gamers/Entusiastas** | Fans de estrategia y alternate history | Quieren interactuar con escenarios, no solo leer |
| **Investigadores** | Académicos en ciencias sociales | Usan contrafactuales como herramienta metodológica |
| **Curiosos** | Público general interested en historia | Diversión intelectual con profundidad real |

---

## 5. Functional Requirements — 10 Levels

### Level 1: Procedural Timeline
- **Input:** Texto libre del usuario describiendo un punto de divergencia
- **Output:** Timeline navegable con eventos generados proceduralmente cada década
- **Criterio de éxito:** Genera ≥10 eventos coherentes por década desde el punto de divergencia

### Level 2: Alternative Companies
- **Genera:** Empresas ficticias con nombre, CEO, fundación, valoración, industria
- **Criterio de éxito:** ≥5 empresas por década, names únicos, names coherentes con la era

### Level 3: Alternative Products
- **Genera:** Productos tecnológicos alternativos (dispositivos, vehículos, medicinas)
- **Incluye:** Descripción, año de lanzamiento, impacto estimado
- **Criterio de éxito:** Productos coherentes con la línea tecnológica del timeline

### Level 4: Alternative People
- **Genera:** Biografías alternativas de personas reales (Einstein, Tesla, Jobs, Turing)
- **Criterio de éxito:** Biografía alternativa coherente con el punto de divergencia

### Level 5: Generated News
- **Genera:** Periódicos completos con headlines, artículos, fechas, autor
- **Formato:** Estilo newspaper layout, múltiples artículos por edición
- **Criterio de éxito:** Artículos referencian entidades del knowledge graph de forma consistente

### Level 6: Alternative Wikipedia
- **Genera:** Artículos de Wikipedia alternativa para países, guerras, inventos, empresas
- **Conexión:** Artículos referencian otros artículos del mismo universo
- **Criterio de éxito:** ≥20 artículos interconectados por timeline

### Level 7: World Map
- **Genera:** Mapa mundial con fronteras, países, potencias modificadas
- **Visual:** Choropleth map, fronteras dinámicas
- **Criterio de éxito:** Mapa refleja geopolítica coherente con el timeline

### Level 8: Economic Simulation
- **Genera:** PIB, población, inflación, desempleo por país/año
- **Modelo:** Simplificado IS-LM + Solow Growth
- **Criterio de éxito:** Datos económicos coherentes con los eventos del timeline

### Level 9: Consistency Engine (Knowledge Graph)
- **Función:** Detecta y resuelve contradicciones en el knowledge graph
- **Métrica:** Score de consistencia ≥90% para timelines generados
- **Criterio de éxito:** No existen referencias a entidades inexistentes

### Level 10: Temporal Exploration
- **Función:** Navegación año por año con estado del mundo en cada punto
- **Visualización:** Timeline interactivo tipo Google Earth para realidades
- **Criterio de éxito:** Transición suave entre años, estado consistente en cada nodo

---

## 6. Non-Functional Requirements

| Requisito | Métrica |
|---|---|
| **Latencia de generación** | <30s para L1-L3, <60s para L4-L6, <120s para L7-L10 |
| **Consistencia** | Score de consistencia ≥90% (L9) |
| **Escalabilidad** | 1000+ timelines concurrentes |
| **Disponibilidad** | 99.9% uptime |
| **Costo por simulación** | <\$0.50 USD promedio |

---

## 7. MoSCoW Prioritization

### Must Have (MVP)
- L1: Procedural Timeline
- L2: Alternative Companies
- L3: Alternative Products
- L9: Consistency Engine (básico)
- API REST funcional
- Auth básico (email + password)

### Should Have (Core)
- L4: Alternative People
- L5: Generated News
- L6: Alternative Wikipedia
- Knowledge Graph completo en Neo4j
- Rate limiting y cost control

### Could Have (Visual)
- L7: World Map
- L8: Economic Simulation
- Visualización interactiva avanzada
- Sharing de timelines generados

### Won't Have (v1)
- Multiplayer / collaboration
- Marketplace de timelines
- Mobile app nativa
- VR/AR visualization

---

## 8. Competitive Analysis

| Producto | Tipo | Limitación principal | Chronos Engine ventaja |
|---|---|---|---|
| ChatGPT + prompts | Generador de texto | Sin consistencia, sin estructura | Knowledge Graph conectado |
| AlterTimeline | AI alternate history | Texto plano, sin navegación | Timeline navegable + entidades |
| Jenova.ai | AI alternate history | Cadena causal simple | Simulación multi-nivel |
| Historia (juego) | Videojuego | Escenarios fijos, no procedural | Generación procedural completa |
| Making History Sandbox | Editor de timelines | Manual, sin AI | Generación automática con AI |

---

## 9. Success Metrics

| Métrica | Target (6 meses) | Target (12 meses) |
|---|---|---|
| Usuarios registrados | 1,000 | 10,000 |
| Timelines generados | 5,000 | 50,000 |
| Duración promedio de sesión | 10 min | 15 min |
| Score de consistencia promedio | 85% | 92% |
| Tasa de retención (7 días) | 30% | 40% |

---

## 10. Risks

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Costos LLM altos | Alto | Caching agresivo, modelos más baratos para generación rutinaria |
| Inconsistencia en outputs | Alto | Motor de consistencia (L9), validación post-generación |
| Latencia alta | Medio | Streaming SSE, generación progresiva |
| Neo4j coste elevado | Medio | Empezar con SQLite, migrar a Neo4j cuando sea necesario |
| Users expect "real" history | Bajo | Marketing claro: "simulación, no predicción" |

---

## 11. Timeline Estimado

| Fase | Duración | Entregable |
|---|---|---|
| Fase 1: MVP | 6 semanas | L1-L3 funcionales, API básica |
| Fase 2: Core Engine | 6 semanas | L4-L6, Knowledge Graph completo |
| Fase 3: Visual | 4 semanas | L7-L8, mapas y dashboards |
| Fase 4: Intelligence | 4 semanas | L9-L10, consistencia y exploración |
| Fase 5: Polish | 3 semanas | UX, performance, testing, deploy |

**Total estimado:** 23 semanas (~6 meses)
