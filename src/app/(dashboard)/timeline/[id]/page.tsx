'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { TimelineExplorer } from '@/components/timeline-explorer';
import { Badge } from '@/components/ui/badge';
import type { TimelineResponse, TimelineEvent, Company, Product } from '@/types';

export default function TimelinePage() {
  const params = useParams();
  const id = params.id as string;
  const [timeline, setTimeline] = useState<TimelineResponse | null>(null);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTimeline() {
      try {
        const response = await fetch(`/api/v1/timelines/${id}`);
        if (!response.ok) throw new Error('Timeline not found');
        const data = await response.json();
        setTimeline(data);
        setEvents(data.events || []);
        setCompanies(data.companies || []);
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timeline');
      } finally {
        setLoading(false);
      }
    }
    fetchTimeline();
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="h-8 w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded" />
          <div className="space-y-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error || !timeline) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Error</h1>
          <p className="text-muted-foreground">{error || 'Timeline not found'}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{timeline.name}</h1>
          <p className="text-muted-foreground">
            Divergence: {timeline.divergence.description}
          </p>
          <div className="flex items-center gap-2">
            <Badge variant={timeline.status === 'completed' ? 'default' : 'secondary'}>
              {timeline.status}
            </Badge>
            <Badge variant="outline">
              Consistencia: {Math.round(timeline.consistencyScore * 100)}%
            </Badge>
            <Badge variant="outline">
              {timeline.yearRange.start} — {timeline.yearRange.end}
            </Badge>
          </div>
        </div>

        <TimelineExplorer
          events={events}
          companies={companies}
          products={products}
        />
      </div>
    </main>
  );
}
