# Chronos Engine — React/Next.js Best Practices

**Version:** 1.0  
**Date:** June 9, 2026

---

## Next.js App Router Rules

1. **Use Server Components by default** — Only add `'use client'` when needed (interactivity, hooks, browser APIs)
2. **Colocate data fetching** — Fetch data in the component that needs it, not in parent
3. **Use `loading.tsx`** — Automatic Suspense boundaries for streaming
4. **Parallel routes** — Use `@slot` for complex layouts
5. **Route Handlers** — Use for API endpoints, not Server Actions for complex operations

---

## React Performance

1. **Avoid re-renders** — Use `React.memo()` for expensive components
2. **Lazy load** — Use `dynamic()` for heavy components (maps, charts)
3. **Virtualize lists** — Use `react-window` for large entity lists
4. **Debounce inputs** — 300ms for search, 200ms for filters
5. **Cache responses** — Use `React.use()` or SWR for data fetching

---

## Streaming Patterns

```typescript
// Server Component with streaming
export default async function TimelinePage({ params }) {
  return (
    <Suspense fallback={<TimelineSkeleton />}>
      <TimelineContent id={params.id} />
    </Suspense>
  );
}
```

---

## Component Patterns

```typescript
// Always type props explicitly
interface EventCardProps {
  event: Event;
  onSelect: (eventId: string) => void;
  compact?: boolean;
}

// Use descriptive prop names
export function EventCard({ event, onSelect, compact = false }: EventCardProps) {
  // ...
}
```

---

## SEO & Metadata

```typescript
// Use generateMetadata for dynamic SEO
export async function generateMetadata({ params }) {
  const timeline = await getTimeline(params.id);
  return {
    title: `${timeline.name} — Chronos Engine`,
    description: timeline.description,
  };
}
```
