# Chronos Engine — API Design

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Overview

REST API con Server-Sent Events (SSE) para operaciones de larga duración. Todas las responses son JSON.

**Base URL:** `/api/v1`

**Authentication:** Bearer token (JWT) en header `Authorization`

---

## 2. Endpoints

### 2.1 Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Registrar nuevo usuario |
| POST | `/auth/login` | Login, retorna JWT |
| POST | `/auth/refresh` | Refrescar token |
| GET | `/auth/me` | Obtener usuario actual |

### 2.2 Timelines

| Method | Endpoint | Description |
|---|---|---|
| POST | `/timelines` | Crear nuevo timeline (inicia generación) |
| GET | `/timelines` | Listar timelines del usuario |
| GET | `/timelines/:id` | Obtener timeline completo |
| DELETE | `/timelines/:id` | Eliminar timeline |
| POST | `/timelines/:id/regenerate` | Regenerar timeline |
| GET | `/timelines/:id/stream` | SSE stream de generación |

### 2.3 Events

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/events` | Todos los eventos del timeline |
| GET | `/timelines/:id/events?year=1980` | Eventos filtrados por año |
| GET | `/timelines/:id/events/:eventId` | Evento específico |

### 2.4 Entities

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/companies` | Empresas del timeline |
| GET | `/timelines/:id/people` | Personas del timeline |
| GET | `/timelines/:id/products` | Productos del timeline |
| GET | `/timelines/:id/countries` | Países del timeline |
| GET | `/timelines/:id/technologies` | Tecnologías del timeline |
| GET | `/timelines/:id/entities/:entityId` | Cualquier entidad por ID |
| GET | `/timelines/:id/entities/:entityId/network` | Red de relaciones de una entidad |

### 2.5 News

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/news` | Todos los artículos |
| GET | `/timelines/:id/news?year=1991&month=3` | Artículos filtrados |
| GET | `/timelines/:id/news/:articleId` | Artículo específico |
| GET | `/timelines/:id/newspaper/:year/:month` | Periódico completo de un mes |

### 2.6 Wikipedia

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/wiki` | Todos los artículos |
| GET | `/timelines/:id/wiki?category=company` | Filtrados por categoría |
| GET | `/timelines/:id/wiki/:articleId` | Artículo específico |

### 2.7 Map

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/map` | GeoJSON completo del mapa |
| GET | `/timelines/:id/map?year=1990` | Estado del mapa en un año |
| GET | `/timelines/:id/countries/:isoCode` | Detalle de un país |
| GET | `/timelines/:id/countries/:isoCode/economics` | Datos económicos del país |

### 2.8 Economics

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/economics` | Resumen económico global |
| GET | `/timelines/:id/economics?year=1990` | Economía global en un año |
| GET | `/timelines/:id/economics/compare?year1=1980&year2=2000` | Comparación entre años |

### 2.9 Consistency

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/consistency` | Score de consistencia |
| GET | `/timelines/:id/consistency/issues` | Lista de inconsistencias |
| POST | `/timelines/:id/consistency/fix` | Auto-fix de inconsistencias |

### 2.10 Exploration

| Method | Endpoint | Description |
|---|---|---|
| GET | `/timelines/:id/explore/:year` | Estado completo del mundo en un año |
| GET | `/timelines/:id/explore/:year/diff?from=1980` | Cambios entre dos años |

---

## 3. Request/Response Examples

### 3.1 Create Timeline

```http
POST /api/v1/timelines
Content-Type: application/json
Authorization: Bearer <token>

{
  "divergence": "Internet invented in 1950",
  "options": {
    "maxYears": 100,
    "detailLevel": "full",
    "includeCompanies": true,
    "includePeople": true,
    "includeProducts": true,
    "includeNews": true,
    "includeWiki": true,
    "includeMap": true,
    "includeEconomics": true
  }
}
```

**Response (201):**
```json
{
  "id": "tl_abc123",
  "status": "generating",
  "divergence": {
    "year": 1950,
    "subject": "internet",
    "type": "technology",
    "description": "Internet invented in 1950"
  },
  "streamUrl": "/api/v1/timelines/tl_abc123/stream",
  "createdAt": "2026-06-09T10:30:00Z"
}
```

### 3.2 Get Timeline

```http
GET /api/v1/timelines/tl_abc123
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": "tl_abc123",
  "name": "Internet invented in 1950",
  "status": "completed",
  "consistencyScore": 0.92,
  "divergence": {
    "year": 1950,
    "subject": "internet",
    "type": "technology"
  },
  "stats": {
    "events": 85,
    "companies": 42,
    "people": 28,
    "products": 35,
    "countries": 25,
    "technologies": 30,
    "newsArticles": 50,
    "wikiArticles": 35,
    "economicSnapshots": 250
  },
  "yearRange": {
    "start": 1950,
    "end": 2050
  },
  "createdAt": "2026-06-09T10:30:00Z",
  "completedAt": "2026-06-09T10:32:15Z"
}
```

### 3.3 SSE Stream

```http
GET /api/v1/timelines/tl_abc123/stream
Accept: text/event-stream
```

**Events:**
```
event: phase
data: {"phase":"parsing","message":"Analyzing divergence point..."}

event: parsed
data: {"year":1950,"subject":"internet","type":"technology","magnitude":"major"}

event: phase
data: {"phase":"generating","decade":1950,"message":"Generating 1950s events..."}

event: events
data: {"decade":1950,"events":[{"year":1952,"title":"MIT launches first commercial network"...}]}

event: companies
data: {"decade":1950,"companies":[{"name":"ARPANET Corp","foundedYear":1953...}]}

event: phase
data: {"phase":"generating","decade":1960,"message":"Generating 1960s events..."}

...

event: phase
data: {"phase":"validating","message":"Checking consistency..."}

event: validation
data: {"score":0.92,"issues":0,"message":"Timeline is consistent"}

event: complete
data: {"timelineId":"tl_abc123","totalEvents":85,"totalCompanies":42}
```

### 3.4 Get Entity Network

```http
GET /api/v1/timelines/tl_abc123/entities/co_abc123/network
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "entity": {
    "id": "co_abc123",
    "type": "company",
    "name": "Neural Electric Corp"
  },
  "connections": [
    {
      "entity": { "id": "pe_xyz", "type": "person", "name": "Margaret Hughes" },
      "relationship": "FOUNDED_BY",
      "direction": "outgoing"
    },
    {
      "entity": { "id": "pr_abc", "type": "product", "name": "MindLink 88" },
      "relationship": "PRODUCES",
      "direction": "outgoing"
    },
    {
      "entity": { "id": "co_def", "type": "company", "name": "Quantum Dynamics" },
      "relationship": "COMPETES_WITH",
      "direction": "bidirectional"
    }
  ],
  "stats": {
    "totalConnections": 12,
    "companies": 3,
    "people": 2,
    "products": 4,
    "technologies": 2,
    "countries": 1
  }
}
```

### 3.5 Get World State at Year

```http
GET /api/v1/timelines/tl_abc123/explore/1990
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "year": 1990,
  "summary": "By 1990, the internet has become a household utility...",
  "events": [
    { "year": 1988, "title": "MindLink reaches 10M users" },
    { "year": 1989, "title": "First quantum router deployed" }
  ],
  "companies": [
    { "name": "Neural Electric Corp", "valuation": 800000000000, "status": "ipo" },
    { "name": "Quantum Dynamics", "valuation": 200000000000, "status": "established" }
  ],
  "technologies": [
    { "name": "Quantum Internet Protocol", "maturity": "production" },
    { "name": "Neural Communication", "maturity": "early_adoption" }
  ],
  "economics": {
    "globalGDP": 45000000000000,
    "averageTechnologyLevel": "advanced",
    "topCountries": [
      { "name": "Neo Britannia", "gdp": 8000000000000 },
      { "name": "Pacific Federation", "gdp": 6500000000000 }
    ]
  }
}
```

---

## 4. Error Responses

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid divergence year. Must be between 0 and 2100.",
    "field": "divergence.year",
    "statusCode": 400
  }
}
```

### Error Codes

| Code | Status | Description |
|---|---|---|
| `VALIDATION_ERROR` | 400 | Invalid input |
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Not allowed to access this resource |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `RATE_LIMITED` | 429 | Too many requests |
| `LLM_ERROR` | 500 | LLM provider error |
| `GENERATION_FAILED` | 500 | Timeline generation failed |
| `INCONSISTENT` | 200 | Timeline has consistency issues (still returns data) |

---

## 5. Rate Limiting Headers

```
X-RateLimit-Limit: 50
X-RateLimit-Remaining: 47
X-RateLimit-Reset: 1686316800
X-CostLimit-Budget: 10.00
X-CostLimit-Remaining: 8.45
```

---

## 6. Pagination

```
GET /api/v1/timelines/tl_abc123/events?page=2&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 85,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": true
  }
}
```
