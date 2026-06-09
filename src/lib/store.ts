import type { Timeline, TimelineEvent, Company, Product } from '@/types';

// In-memory store for MVP. Replace with Neo4j in Phase 2.
const timelines = new Map<string, Timeline>();

export function generateId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function createTimeline(data: {
  name: string;
  divergenceYear: number;
  divergencePoint: string;
  description: string;
}): Timeline {
  const id = generateId('tl');
  const now = new Date();
  const timeline: Timeline = {
    id,
    name: data.name,
    divergenceYear: data.divergenceYear,
    divergencePoint: data.divergencePoint,
    description: data.description,
    status: 'generating',
    consistencyScore: 0,
    createdBy: 'anonymous',
    createdAt: now,
    updatedAt: now,
    events: [],
    companies: [],
    products: [],
  };
  timelines.set(id, timeline);
  return timeline;
}

export function getTimeline(id: string): Timeline | undefined {
  return timelines.get(id);
}

export function updateTimeline(id: string, updates: Partial<Timeline>): Timeline | undefined {
  const timeline = timelines.get(id);
  if (!timeline) return undefined;
  const updated = { ...timeline, ...updates, updatedAt: new Date() };
  timelines.set(id, updated);
  return updated;
}

export function addEventsToTimeline(id: string, events: TimelineEvent[]): void {
  const timeline = timelines.get(id);
  if (!timeline) return;
  timeline.events.push(...events);
  timeline.updatedAt = new Date();
}

export function addCompaniesToTimeline(id: string, companies: Company[]): void {
  const timeline = timelines.get(id);
  if (!timeline) return;
  timeline.companies.push(...companies);
  timeline.updatedAt = new Date();
}

export function addProductsToTimeline(id: string, products: Product[]): void {
  const timeline = timelines.get(id);
  if (!timeline) return;
  timeline.products.push(...products);
  timeline.updatedAt = new Date();
}

export function listTimelines(): Timeline[] {
  return Array.from(timelines.values());
}

export function deleteTimeline(id: string): boolean {
  return timelines.delete(id);
}
