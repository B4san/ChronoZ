# Chronos Engine — Knowledge Graph Schema

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Overview

El Knowledge Graph es el corazón de Chronos Engine. Cada timeline generado se almacena como un subgrafo conectado en Neo4j, donde todos los nodos (eventos, empresas, personas, productos, países) están linked por relaciones causales y temporales.

---

## 2. Node Types

### 2.1 Timeline
El nodo raíz de cada simulación.

```cypher
(:Timeline {
  Id: "tl_xxxxx",
  name: "Internet invented in 1950",
  divergenceYear: 1950,
  divergencePoint: "ARPANET precursor network developed at MIT",
  description: "What if the internet was invented 20 years earlier?",
  createdAt: datetime(),
  updatedAt: datetime(),
  status: "completed",          // draft | generating | completed | failed
  consistencyScore: 0.92,
  createdBy: "user_xxxxx"
})
```

### 2.2 Event
Un punto en la línea temporal.

```cypher
(:Event {
  Id: "ev_xxxxx",
  year: 1955,
  title: "MIT launches the first commercial network",
  description: "The Massachusetts Institute of Technology...",
  category: "technology",       // technology | politics | economics | culture | science | military
  impact: "high",               // low | medium | high | critical
  causalityStrength: 0.85,     // 0-1, qué tan directamente es causado por el divergencia
  createdAt: datetime()
})
```

### 2.3 Company
Empresa alternativa generada.

```cypher
(:Company {
  Id: "co_xxxxx",
  name: "Neural Electric Corp",
  foundedYear: 1963,
  industry: "telecommunications",
  valuation: 3200000000000,     // en USD (3.2T)
  headquarters: "New London",
  status: "active",             // active | acquired | defunct | ipo
  description: "Pioneer in neural communication devices...",
  createdAt: datetime()
})
```

### 2.4 Person
Persona alternativa (biografía modificada de persona real o generada).

```cypher
(:Person {
  Id: "pe_xxxxx",
  name: "Margaret Hughes",
  bornYear: 1935,
  diedYear: null,               // null = still alive
  nationality: "British",
  occupation: "entrepreneur",
  biography: "Born in Manchester, Hughes pioneered...",
  significance: "high",         // low | medium | high | legendary
  alternateFate: "In this timeline, instead of becoming a teacher, she founded Neural Electric Corp.",
  realWorldEquivalent: null,    // null if original character
  createdAt: datetime()
})
```

### 2.5 Product
Producto alternativo.

```cypher
(:Product {
  Id: "pr_xxxxx",
  name: "MindLink 88",
  category: "communication",    // communication | computing | transportation | medicine | entertainment
  launchYear: 1988,
  description: "First neural communication device",
  impact: "revolutionary",      // minor | moderate | significant | revolutionary
  priceUSD: 2499,
  unitsSold: 15000000,
  createdAt: datetime()
})
```

### 2.6 Country
País con estado alterado.

```cypher
(:Country {
  Id: "co_xxxxx",
  name: "Neo Britannia",
  isoCode: "NB",
  formedYear: 1962,
  dissolvedYear: null,
  governmentType: "technocracy",
  population: 85000000,
  gdp: 4200000000000,
  gdpPerCapita: 49411,
  technologyLevel: "advanced",  // primitive | developing | modern | advanced | futuristic
  description: "Formed from the merger of UK and Ireland...",
  createdAt: datetime()
})
```

### 2.7 Technology
Tecnología alternativa (más granular que Producto).

```cypher
(:Technology {
  Id: "te_xxxxx",
  name: "Quantum Internet Protocol",
  category: "networking",
  inventedYear: 1982,
  description: "Protocol for quantum-entangled data transmission",
  maturity: "production",       // concept | prototype | early_adoption | production | legacy
  createdAt: datetime()
})
```

### 2.8 NewsArticle
Artículo de periódico alternativo.

```cypher
(:NewsArticle {
  Id: "na_xxxxx",
  newspaperName: "The New London Times",
  date: date("1991-03-12"),
  headline: "MindLink reaches 100 million users",
  body: "In a landmark achievement...",
  author: "Sarah Chen",
  category: "technology",
  createdAt: datetime()
})
```

### 2.9 WikiArticle
Artículo de Wikipedia alternativa.

```cypher
(:WikiArticle {
  Id: "wa_xxxxx",
  title: "Neural Electric Corp",
  category: "company",          // company | country | event | person | technology
  content: "Neural Electric Corp is a telecommunications company...",
  lastEdited: datetime(),
  createdAt: datetime()
})
```

### 2.10 EconomicSnapshot
Estado económico de un país en un año dado.

```cypher
(:EconomicSnapshot {
  Id: "es_xxxxx",
  year: 1985,
  gdp: 2100000000000,
  gdpGrowth: 4.2,
  inflation: 3.1,
  unemployment: 5.8,
  population: 72000000,
  giniCoefficient: 0.35,
  literacyRate: 0.96,
  lifeExpectancy: 74.5,
  createdAt: datetime()
})
```

### 2.11 DivergencePoint
El evento que cambia la historia.

```cypher
(:DivergencePoint {
  Id: "dp_xxxxx",
  originalYear: 1970,
  category: "technology",
  title: "ARPANET precursor at MIT",
  description: "In real history, this happened in 1969. Here it happens in 1950.",
  prompt: "What if the internet was invented in 1950?",
  createdAt: datetime()
})
```

---

## 3. Relationship Types

### 3.1 Temporal Relationships
```cypher
(:Timeline)-[:HAS_DIVERGENCE]->(:DivergencePoint)
(:Timeline)-[:CONTAINS_EVENT]->(:Event)
(:DivergencePoint)-[:CAUSES]->(:Event)
(:Event)-[:PRECEDES]->(:Event)          // temporal ordering
(:Event)-[:FOLLOWS]->(:Event)
```

### 3.2 Causal Relationships
```cypher
(:Event)-[:CAUSED_BY]->(:Event)
(:Event)-[:INFLUENCED]->(:Event)
(:Event)-[:LED_TO]->(:Company)
(:Event)-[:LED_TO]->(:Technology)
(:Event)-[:TRIGGERED]->(:NewsArticle)
```

### 3.3 Entity Relationships
```cypher
(:Company)-[:FOUNDED_BY]->(:Person)
(:Company)-[:ACQUIRED]->(:Company)
(:Company)-[:COMPETES_WITH]->(:Company)
(:Company)-[:PRODUCES]->(:Product)
(:Company)-[:OPERATES_IN]->(:Country)
(:Company)-[:USES_TECHNOLOGY]->(:Technology)

(:Person)-[:BORN_IN]->(:Country)
(:Person)-[:WORKS_FOR]->(:Company)
(:Person)-[:INFLUENCED]->(:Person)
(:Person)-[:CREATED]->(:Technology)
(:Person)-[:MENTORED]->(:Person)

(:Product)-[:USES_TECHNOLOGY]->(:Technology)
(:Product)-[:AVAILABLE_IN]->(:Country)
(:Product)-[:SUCCEEDED_BY]->(:Product)
(:Product)-[:PREDECESSOR_OF]->(:Product)

(:Technology)-[:ENABLED_BY]->(:Technology)
(:Technology)-[:SUPERSEDES]->(:Technology)

(:Country)-[:BORDERS]->(:Country)
(:Country)-[:ALLEY_WITH]->(:Country)
(:Country)-[:AT_WAR_WITH]->(:Country)
(:Country)-[:TRADES_WITH]->(:Country)
```

### 3.4 Content Relationships
```cypher
(:NewsArticle)-[:MENTIONS]->(:Company)
(:NewsArticle)-[:MENTIONS]->(:Person)
(:NewsArticle)-[:MENTIONS]->(:Event)
(:NewsArticle)-[:MENTIONS]->(:Technology)

(:WikiArticle)-[:ABOUT]->(:Company)
(:WikiArticle)-[:ABOUT]->(:Person)
(:WikiArticle)-[:ABOUT]->(:Country)
(:WikiArticle)-[:REFERENCES]->(:WikiArticle)

(:EconomicSnapshot)-[:FOR_COUNTRY]->(:Country)
```

---

## 4. Indexes

```cypher
-- Primary ID indexes (for MERGE operations)
CREATE INDEX timeline_id FOR (t:Timeline) ON (t.Id);
CREATE INDEX event_id FOR (e:Event) ON (e.Id);
CREATE INDEX company_id FOR (c:Company) ON (c.Id);
CREATE INDEX person_id FOR (p:Person) ON (p.Id);
CREATE INDEX product_id FOR (pr:Product) ON (pr.Id);
CREATE INDEX country_id FOR (c:Country) ON (c.Id);
CREATE INDEX technology_id FOR (t:Technology) ON (t.Id);
CREATE INDEX newsarticle_id FOR (n:NewsArticle) ON (n.Id);
CREATE INDEX wikiarticle_id FOR (w:WikiArticle) ON (w.Id);
CREATE INDEX economicsnapshot_id FOR (es:EconomicSnapshot) ON (es.Id);
CREATE INDEX divergencepoint_id FOR (d:DivergencePoint) ON (d.Id);

-- Temporal indexes
CREATE INDEX event_year FOR (e:Event) ON (e.year);
CREATE INDEX company_founded FOR (c:Company) ON (c.foundedYear);
CREATE INDEX technology_invented FOR (t:Technology) ON (t.inventedYear);

-- Search indexes
CREATE INDEX company_name FOR (c:Company) ON (c.name);
CREATE INDEX person_name FOR (p:Person) ON (p.name);
CREATE INDEX country_name FOR (c:Country) ON (c.name);
CREATE INDEX timeline_name FOR (t:Timeline) ON (t.name);

-- Full-text search
CREATE FULLTEXT INDEX entity_search FOR (n:Company|Person|Product|Country|Technology) ON EACH [n.name, n.description];
```

---

## 5. Core Queries

### 5.1 Get Full Timeline
```cypher
MATCH (t:Timeline {Id: $timelineId})
OPTIONAL MATCH (t)-[:HAS_DIVERGENCE]->(d:DivergencePoint)
OPTIONAL MATCH (t)-[:CONTAINS_EVENT]->(e:Event)
OPTIONAL MATCH (t)-[:CONTAINS_EVENT]->(c:Company)
OPTIONAL MATCH (t)-[:CONTAINS_EVENT]->(p:Person)
OPTIONAL MATCH (t)-[:CONTAINS_EVENT]->(pr:Product)
RETURN t, d, 
       collect(DISTINCT e) AS events,
       collect(DISTINCT c) AS companies,
       collect(DISTINCT p) AS people,
       collect(DISTINCT pr) AS products;
```

### 5.2 Get State at Year
```cypher
MATCH (t:Timeline {Id: $timelineId})
MATCH (e:Event)
WHERE e.year <= $year
OPTIONAL MATCH (e)-[:LED_TO]->(c:Company)
OPTIONAL MATCH (e)-[:LED_TO]->(t2:Technology)
OPTIONAL MATCH (c)-[:OPERATES_IN]->(co:Country)
RETURN e, collect(DISTINCT c) AS companies, 
       collect(DISTINCT t2) AS technologies,
       collect(DISTINCT co) AS countries
ORDER BY e.year;
```

### 5.3 Get Entity Network
```cypher
MATCH (entity {Id: $entityId})
OPTIONAL MATCH (entity)-[r]-(connected)
WHERE NOT connected:Timeline
RETURN entity, type(r) AS relationship, connected
LIMIT 50;
```

### 5.4 Consistency Check — Orphan References
```cypher
MATCH (a)-[r]->(b)
WHERE NOT EXISTS {
  MATCH (other {Id: b.Id})
}
AND NOT type(r) IN ['HAS_DIVERGENCE', 'CONTAINS_EVENT']
RETURN a, type(r), b
LIMIT 100;
```

### 5.5 Consistency Check — Temporal Violations
```cypher
MATCH (predecessor:Event)-[:CAUSED_BY]->(successor:Event)
WHERE predecessor.year > successor.year
RETURN predecessor, successor;
```

### 5.6 Get All Entities for a Country at Year
```cypher
MATCH (c:Country {Id: $countryId})
MATCH (co:Company)-[:OPERATES_IN]->(c)
WHERE co.foundedYear <= $year
OPTIONAL MATCH (co)-[:PRODUCES]->(p:Product)
WHERE p.launchYear <= $year
OPTIONAL MATCH (co)-[:FOUNDED_BY]->(person:Person)
RETURN co, collect(DISTINCT p) AS products, collect(DISTINCT person) AS founders;
```

### 5.7 Consistency Score Calculator
```cypher
MATCH (t:Timeline {Id: $timelineId})
MATCH (n)
WHERE n:Company OR n:Person OR n:Product OR n:Country OR n:Technology
  AND n.-[:PART_OF]->(t)
OPTIONAL MATCH (n)-[r]->(m)
WHERE m:Company OR m:Person OR m:Product OR m:Country OR m:Technology
WITH n, 
     count(r) AS totalRefs,
     sum(CASE WHEN m IS NOT NULL THEN 1 ELSE 0 END) AS validRefs
WITH sum(validRefs) AS totalValid, sum(totalRefs) AS totalRefs
RETURN toFloat(totalValid) / CASE WHEN totalRefs = 0 THEN 1 ELSE totalRefs END AS consistencyScore;
```

---

## 6. Write Patterns

### 6.1 Create Event
```cypher
MATCH (t:Timeline {Id: $timelineId})
CREATE (e:Event {
  Id: $eventId,
  year: $year,
  title: $title,
  description: $description,
  category: $category,
  impact: $impact,
  causalityStrength: $causalityStrength,
  createdAt: datetime()
})
CREATE (t)-[:CONTAINS_EVENT]->(e)
RETURN e;
```

### 6.2 Link Causal Chain
```cypher
MATCH (cause:Event {Id: $causeId})
MATCH (effect:Event {Id: $effectId})
CREATE (cause)-[:CAUSED_BY {
  strength: $strength,
  description: $description
}]->(effect);
```

### 6.3 Upsert Company
```cypher
MERGE (c:Company {Id: $companyId})
ON CREATE SET
  c.name = $name,
  c.foundedYear = $foundedYear,
  c.industry = $industry,
  c.valuation = $valuation,
  c.headquarters = $headquarters,
  c.status = $status,
  c.description = $description,
  c.createdAt = datetime()
ON MATCH SET
  c.valuation = $valuation,
  c.status = $status,
  c.updatedAt = datetime()
RETURN c;
```

---

## 7. Data Volume Estimates

| Entity Type | Per Timeline | 1000 Timelines |
|---|---|---|
| Events | 50-100 | 50K-100K |
| Companies | 30-50 | 30K-50K |
| People | 20-40 | 20K-40K |
| Products | 20-40 | 20K-40K |
| Countries | 10-30 | 10K-30K |
| Technologies | 15-30 | 15K-30K |
| NewsArticles | 30-60 | 30K-60K |
| WikiArticles | 20-40 | 20K-40K |
| EconomicSnapshots | 100-300 | 100K-300K |
| **Total Nodes** | **~300-600** | **~300K-600K** |
| **Total Relationships** | **~500-1200** | **~500K-1.2M** |

**Neo4j Aura Recommendation:** Professional tier (up to 500K nodes) for MVP, scale to Business for production.
