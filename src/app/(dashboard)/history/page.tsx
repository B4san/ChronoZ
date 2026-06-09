'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Timeline } from '@/types';

export default function HistoryPage() {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimelines() {
      try {
        const res = await fetch('/api/v1/timelines');
        const data = await res.json();
        setTimelines(data.data || []);
      } catch {
        // Silent fail - empty list shown
      } finally {
        setLoading(false);
      }
    }
    fetchTimelines();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Timelines</h1>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Timelines</h1>
          <Link
            href="/"
            className="text-sm text-primary hover:underline"
          >
            + Nuevo Timeline
          </Link>
        </div>

        {timelines.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-muted-foreground text-lg">
              No hay timelines generados aún.
            </p>
            <Link
              href="/"
              className="inline-block px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
            >
              Crear tu primer timeline
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {timelines.map((tl) => (
              <Link key={tl.id} href={`/timeline/${tl.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{tl.name}</CardTitle>
                      <Badge variant={tl.status === 'completed' ? 'default' : 'secondary'}>
                        {tl.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>📅 {tl.divergenceYear}</span>
                      <span>🎯 {tl.events.length} eventos</span>
                      <span>🏢 {tl.companies.length} empresas</span>
                      <span>📦 {tl.products.length} productos</span>
                      {tl.consistencyScore > 0 && (
                        <span>✅ {Math.round(tl.consistencyScore * 100)}%</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
