import type { Timeline, TimelineEvent } from '@/types';

export interface ConsistencyIssue {
  type: 'temporal' | 'referential' | 'causal';
  severity: 'warning' | 'error';
  message: string;
  entityId?: string;
}

export interface ConsistencyResult {
  score: number;
  issues: ConsistencyIssue[];
  totalChecks: number;
  passedChecks: number;
}

export function validateTimeline(timeline: Timeline): ConsistencyResult {
  const issues: ConsistencyIssue[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  // Check 1: Events must be after divergence year
  for (const event of timeline.events) {
    totalChecks++;
    if (event.year < timeline.divergenceYear) {
      issues.push({
        type: 'temporal',
        severity: 'error',
        message: `Event "${event.title}" (${event.year}) is before divergence year (${timeline.divergenceYear})`,
        entityId: event.id,
      });
    } else {
      passedChecks++;
    }
  }

  // Check 2: Companies founded after divergence
  for (const company of timeline.companies) {
    totalChecks++;
    if (company.foundedYear < timeline.divergenceYear) {
      issues.push({
        type: 'temporal',
        severity: 'error',
        message: `Company "${company.name}" founded in ${company.foundedYear}, before divergence (${timeline.divergenceYear})`,
        entityId: company.id,
      });
    } else {
      passedChecks++;
    }
  }

  // Check 3: Products launched after divergence
  for (const product of timeline.products) {
    totalChecks++;
    if (product.launchYear < timeline.divergenceYear) {
      issues.push({
        type: 'temporal',
        severity: 'error',
        message: `Product "${product.name}" launched in ${product.launchYear}, before divergence (${timeline.divergenceYear})`,
        entityId: product.id,
      });
    } else {
      passedChecks++;
    }
  }

  // Check 4: Products reference existing companies
  const companyNames = new Set(timeline.companies.map((c) => c.name));
  for (const product of timeline.products) {
    totalChecks++;
    if (companyNames.has(product.manufacturer)) {
      passedChecks++;
    } else {
      issues.push({
        type: 'referential',
        severity: 'warning',
        message: `Product "${product.name}" references manufacturer "${product.manufacturer}" not in companies list`,
        entityId: product.id,
      });
    }
  }

  // Check 5: No duplicate event titles within same decade
  const eventsByDecade = new Map<number, TimelineEvent[]>();
  for (const event of timeline.events) {
    const decade = Math.floor(event.year / 10) * 10;
    const existing = eventsByDecade.get(decade) || [];
    existing.push(event);
    eventsByDecade.set(decade, existing);
  }

  for (const [decade, events] of eventsByDecade) {
    const titles = events.map((e) => e.title.toLowerCase());
    totalChecks++;
    const uniqueTitles = new Set(titles);
    if (uniqueTitles.size === titles.length) {
      passedChecks++;
    } else {
      issues.push({
        type: 'causal',
        severity: 'warning',
        message: `Duplicate event titles found in decade ${decade}s`,
      });
    }
  }

  // Check 6: Causal strength decreasing over time (events farther from divergence should have lower causality)
  const sortedEvents = [...timeline.events].sort((a, b) => a.year - b.year);
  if (sortedEvents.length >= 3) {
    totalChecks++;
    const firstThirdAvg = average(sortedEvents.slice(0, Math.ceil(sortedEvents.length / 3)).map((e) => e.causalityStrength));
    const lastThirdAvg = average(sortedEvents.slice(-Math.ceil(sortedEvents.length / 3)).map((e) => e.causalityStrength));
    if (firstThirdAvg >= lastThirdAvg) {
      passedChecks++;
    } else {
      issues.push({
        type: 'causal',
        severity: 'warning',
        message: 'Events farther from divergence have higher causality than closer events',
      });
    }
  }

  const score = totalChecks > 0 ? passedChecks / totalChecks : 1;

  return { score, issues, totalChecks, passedChecks };
}

function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}
