import { describe, it, expect, beforeEach } from 'vitest';
import {
  createTimeline,
  getTimeline,
  updateTimeline,
  addEventsToTimeline,
  addCompaniesToTimeline,
  addProductsToTimeline,
  listTimelines,
  deleteTimeline,
  generateId,
} from '@/lib/store';

describe('Timeline Store', () => {
  beforeEach(() => {
    // Note: In-memory store persists between tests in same process
    // This is acceptable for unit tests
  });

  it('generates unique IDs', () => {
    const id1 = generateId('tl');
    const id2 = generateId('tl');
    expect(id1).not.toBe(id2);
    expect(id1).toMatch(/^tl_/);
  });

  it('creates and retrieves a timeline', () => {
    const timeline = createTimeline({
      name: 'Internet in 1950',
      divergenceYear: 1950,
      divergencePoint: 'ARPANET precursor',
      description: 'What if the internet was invented in 1950?',
    });

    expect(timeline.id).toMatch(/^tl_/);
    expect(timeline.name).toBe('Internet in 1950');
    expect(timeline.status).toBe('generating');

    const retrieved = getTimeline(timeline.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.name).toBe('Internet in 1950');
  });

  it('updates a timeline', () => {
    const timeline = createTimeline({
      name: 'Test',
      divergenceYear: 2000,
      divergencePoint: 'Test point',
      description: 'Test description',
    });

    const updated = updateTimeline(timeline.id, { status: 'completed' });
    expect(updated?.status).toBe('completed');
  });

  it('adds events to timeline', () => {
    const timeline = createTimeline({
      name: 'Test',
      divergenceYear: 2000,
      divergencePoint: 'Test',
      description: 'Test',
    });

    addEventsToTimeline(timeline.id, [
      {
        id: 'ev_1',
        timelineId: timeline.id,
        year: 2005,
        title: 'First event',
        description: 'Description',
        category: 'technology',
        impact: 'medium',
        causalityStrength: 0.5,
      },
    ]);

    const retrieved = getTimeline(timeline.id);
    expect(retrieved?.events).toHaveLength(1);
    expect(retrieved?.events[0].year).toBe(2005);
  });

  it('lists all timelines', () => {
    const count = listTimelines().length;
    createTimeline({
      name: 'List Test',
      divergenceYear: 2000,
      divergencePoint: 'Test',
      description: 'Test',
    });
    expect(listTimelines().length).toBe(count + 1);
  });

  it('deletes a timeline', () => {
    const timeline = createTimeline({
      name: 'Delete Test',
      divergenceYear: 2000,
      divergencePoint: 'Test',
      description: 'Test',
    });
    const result = deleteTimeline(timeline.id);
    expect(result).toBe(true);
    expect(getTimeline(timeline.id)).toBeUndefined();
  });
});
