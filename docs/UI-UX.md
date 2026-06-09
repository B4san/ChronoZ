# Chronos Engine — UI/UX Design

**Version:** 1.0  
**Date:** June 9, 2026

---

## 1. Design Principles

1. **Clarity over complexity** — La información debe ser digerible, no abrumadora
2. **Progressive disclosure** — Mostrar resumen primero, detalle al hacer click
3. **Consistency visual** — Mismo patrón para tipos similares de contenido
4. **Performance feel** — Streaming progresivo, nunca pantalla vacía
5. **Responsive** — Desktop-first pero funcional en tablet/mobile

---

## 2. Design System

### 2.1 Colors

```css
:root {
  /* Primary - Deep Indigo (temporal, misterioso) */
  --primary-50: #e8eaf6;
  --primary-500: #3f51b5;
  --primary-900: #1a237e;

  /* Accent - Amber (destacados, eventos) */
  --accent-50: #fff8e1;
  --accent-500: #ffc107;
  --accent-900: #ff8f00;

  /* Neutrals */
  --bg: #0f0f1a;
  --bg-card: #1a1a2e;
  --bg-hover: #252540;
  --text: #e0e0e0;
  --text-muted: #9e9e9e;
  --border: #2d2d44;

  /* Semantic */
  --success: #4caf50;
  --warning: #ff9800;
  --error: #f44336;
  --info: #2196f3;

  /* Impact colors */
  --impact-low: #78909c;
  --impact-medium: #ffb74d;
  --impact-high: #ff8a65;
  --impact-critical: #ef5350;
}
```

### 2.2 Typography

```
Headings: Inter, 700
Body: Inter, 400
Mono: JetBrains Mono, 400

H1: 2.5rem / 1.2
H2: 1.875rem / 1.3
H3: 1.5rem / 1.4
H4: 1.25rem / 1.5
Body: 1rem / 1.6
Small: 0.875rem / 1.5
```

### 2.3 Component Tokens

```
Border radius: 8px (cards), 4px (buttons), 12px (modals)
Shadows: sm (cards), md (dropdowns), lg (modals)
Spacing: 4px base unit (4, 8, 12, 16, 20, 24, 32, 40, 48, 64)
```

---

## 3. Page Layout

### 3.1 App Shell

```
┌──────────────────────────────────────────────────┐
│  Logo    [Explore] [My Timelines] [Map]    [Avatar]│
├──────────────────────────────────────────────────┤
│                                                    │
│  ┌──────────────────────────────────────────────┐│
│  │                                              ││
│  │              Main Content Area               ││
│  │                                              ││
│  │                                              ││
│  └──────────────────────────────────────────────┘│
│                                                    │
└──────────────────────────────────────────────────┘
```

### 3.2 Landing Page

```
┌──────────────────────────────────────────────────┐
│                                                    │
│          CHRONOS ENGINE                           │
│    Motor Procedural de Civilizaciones             │
│              Alternativas                         │
│                                                    │
│  ┌──────────────────────────────────────────────┐│
│  │  ¿Qué habría pasado si...?                   ││
│  │  [___________________________________] [GO]  ││
│  │                                              ││
│  │  Ejemplos:                                   ││
│  │  • Internet inventado en 1950                ││
│  • Tesla nunca existió                          ││
│  • La imprenta en el Imperio Romano            ││
│  │  • Los dinosaurios nunca se extinguen       ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐          │
│  │ L1-L3   │  │ L4-L6   │  │ L7-L10  │          │
│  │ Timeline│  │ Entities│  │ World   │          │
│  │ + Empresas│  │ + News │  │ Map + Eco│          │
│  └─────────┘  └─────────┘  └─────────┘          │
│                                                    │
└──────────────────────────────────────────────────┘
```

---

## 4. Key Pages

### 4.1 Timeline Explorer

```
┌──────────────────────────────────────────────────┐
│  Internet invented in 1950                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Divergence: ARPANET precursor at MIT, 1950       │
│  Consistency: ████████░░ 92%                      │
│                                                    │
│  ┌─ 1950s ─────────────────────────────────────┐│
│  │  ● MIT launches precursor network            ││
│  │  │                                           ││
│  │  ● First commercial nodes deployed           ││
│  │  │                                           ││
│  │  ● Government adopts network technology      ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  ┌─ 1960s ─────────────────────────────────────┐│
│  │  ● Network reaches 1M users                  ││
│  │  │                                           ││
│  │  ● Neural Electric Corp founded              ││
│  │  │                                           ││
│  │  ● First email protocol standardized         ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  [Decade ▾] [Category ▾] [Impact ▾]             │
└──────────────────────────────────────────────────┘
```

### 4.2 Entity Detail Card

```
┌──────────────────────────────────────────────────┐
│  🏢 Neural Electric Corp                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                    │
│  Founded: 1963    HQ: New London                  │
│  Industry: Telecommunications                     │
│  Valuation: $3.2T     Status: IPO                 │
│  CEO: Margaret Hughes (b. 1935)                   │
│                                                    │
│  ┌─ Key Facts ─────────────────────────────────┐│
│  │  • Pioneer in neural communication           ││
│  │  • 15M+ employees worldwide                  ││
│  │  • Created MindLink product line             ││
│  │  • Competes with Quantum Dynamics            ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  ┌─ Timeline ──────────────────────────────────┐│
│  │  1963: Founded by Margaret Hughes            ││
│  │  1970: First product launch                  ││
│  │  1985: IPO at $500B valuation                ││
│  │  1995: Acquired CommTech Inc                 ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  [View on Map] [View Products] [Related People]  │
└──────────────────────────────────────────────────┘
```

### 4.3 World Map

```
┌──────────────────────────────────────────────────┐
│  World Map — 1990                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  ┌──────────────────────────────────────────────┐│
│  │                                              ││
│  │           ┌─────┐                            ││
│  │     ┌────┤ NB  ├────┐                       ││
│  │     │    └─────┘    │                        ││
│  │  ┌──┴──┐      ┌──┴──┐                       ││
│  │  │ PF  │      │ EA  │                       ││
│  │  └─────┘      └─────┘                       ││
│  │                                              ││
│  │  Legend:                                     ││
│  │  ███ Neo Britannia (GDP: $8T)              ││
│  │  ███ Pacific Federation (GDP: $6.5T)       ││
│  │  ███ Eurasian Alliance (GDP: $5T)          ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  [Year: 1990 ◀ 1980 ▶ 2000]                     │
│  [Metric: GDP ▾] [Population ▾] [Tech Level ▾]  │
└──────────────────────────────────────────────────┘
```

### 4.4 Newspaper View

```
┌──────────────────────────────────────────────────┐
│  ╔══════════════════════════════════════════════╗│
│  ║        THE NEW LONDON TIMES                  ║│
│  ║        March 12, 1991                        ║│
│  ╠══════════════════════════════════════════════╣│
│  ║                                              ║│
│  ║  MindLink Reaches 100 Million Users          ║│
│  ║  ─────────────────────────────────────       ║│
│  ║  In a landmark achievement for the           ║│
│  ║  telecommunications industry, Neural         ║│
│  ║  Electric Corp announced today that its       ║│
│  ║  MindLink device has surpassed 100 million   ║│
│  ║  active users worldwide...                   ║│
│  ║                                              ║│
│  ║  By Sarah Chen, Technology Correspondent     ║│
│  ╠══════════════════════════════════════════════╣│
│  ║                                              ║│
│  ║  ┌─ Also Today ─────────────────────────┐   ║│
│  ║  │ • Quantum Router Deployed in Berlin  │   ║│
│  ║  │ • Pacific Federation GDP Hits $6T    │   ║│
│  ║  │ • New Education Act Passed           │   ║│
│  ║  └──────────────────────────────────────┘   ║│
│  ╚══════════════════════════════════════════════╝│
└──────────────────────────────────────────────────┘
```

### 4.5 Economics Dashboard

```
┌──────────────────────────────────────────────────┐
│  Economics Dashboard — Neo Britannia             │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                    │
│  ┌─ GDP Growth ────────────────────────────────┐│
│  │  📈                                         ││
│  │  5%|     ╱╲    ╱╲                          ││
│  │  4%|  ╱╲╱  ╲╱╲╱  ╲╱╲                      ││
│  │  3%|╱                  ╲                   ││
│  │  2%|                    ╲╱                 ││
│  │    └─────────────────────────────           ││
│  │    1970  1975  1980  1985  1990            ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  ┌─ Key Indicators (1990) ────────────────────┐│
│  │  GDP: $8.0T    Growth: 4.2%               ││
│  │  Inflation: 3.1%  Unemployment: 5.8%      ││
│  │  Population: 85M   GDP/capita: $94,117     ││
│  └──────────────────────────────────────────────┘│
│                                                    │
│  [Compare Years] [Export CSV] [Export JSON]      │
└──────────────────────────────────────────────────┘
```

---

## 5. Key Components

### 5.1 Component Library

| Component | Description | Props |
|---|---|---|
| `TimelineExplorer` | Lista vertical de eventos navegable | events, filters, onEventClick |
| `TimelineSlider` | Slider horizontal para navegar años | year, min, max, onChange |
| `EntityCard` | Card genérica para cualquier entidad | entity, type, compact |
| `EntityDetail` | Vista detallada de una entidad | entity, connections |
| `EntityNetwork` | Grafo de relaciones visualizado | entity, connections |
| `EventCard` | Card para un evento individual | event, causalityLinks |
| `DecadeView` | Agrupación de eventos por década | decade, events, companies |
| `NewspaperView` | Layout estilo periódico | article, relatedArticles |
| `WikiView` | Layout estilo Wikipedia | article, linkedArticles |
| `WorldMap` | Mapa interactivo con choropleth | geojson, year, metric |
| `CountryDetail` | Panel lateral de país | country, economics |
| `EconomicsChart` | Gráficos de métricas económicas | data, metrics, yearRange |
| `ConsistencyBadge` | Badge con score de consistencia | score |
| `StreamingIndicator` | Indicador de generación en progreso | phase, progress |
| `DivergenceInput` | Formulario de input del usuario | onSubmit |
| `FilterBar` | Filtros para timeline/filters | filters, onChange |
| `EntityGrid` | Grid responsive de entities | entities, type |
| `YearHeader` | Header con año y contexto | year, summary |

### 5.2 Streaming UX Pattern

```typescript
// Progressive loading as entities are generated
function StreamingTimeline({ timelineId }: { timelineId: string }) {
  const [events, setEvents] = useState<Event[]>([]);
  const [phase, setPhase] = useState<string>('parsing');
  
  useEffect(() => {
    const source = new EventSource(`/api/v1/timelines/${timelineId}/stream`);
    
    source.addEventListener('events', (e) => {
      const data = JSON.parse(e.data);
      setEvents(prev => [...prev, ...data.events]);
    });
    
    source.addEventListener('phase', (e) => {
      const data = JSON.parse(e.data);
      setPhase(data.phase);
    });
    
    return () => source.close();
  }, [timelineId]);
  
  return (
    <div>
      <StreamingIndicator phase={phase} />
      <TimelineExplorer events={events} />
    </div>
  );
}
```

---

## 6. Responsive Breakpoints

```
Mobile:  < 640px   — Single column, stacked layout
Tablet:  640-1024px — Two column, collapsible sidebar
Desktop: > 1024px   — Full layout with sidebar
Wide:    > 1440px   — Extra sidebar for entity details
```

---

## 7. Animations

| Element | Animation | Duration |
|---|---|---|
| Event card appear | Fade in + slide up | 200ms |
| Entity expand | Scale from center | 300ms |
| Year transition | Horizontal slide | 400ms |
| Map zoom | Smooth zoom | 300ms |
| Consistency score | Number count up | 500ms |
| Streaming indicator | Pulse animation | 1000ms loop |
