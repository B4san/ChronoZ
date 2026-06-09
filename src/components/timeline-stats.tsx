'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { TimelineEvent, Company, Product } from '@/types';

interface TimelineStatsProps {
  events: TimelineEvent[];
  companies: Company[];
  products: Product[];
  divergenceYear: number;
}

export function TimelineStats({ events, companies, products, divergenceYear }: TimelineStatsProps) {
  const decades = Math.ceil(events.length > 0
    ? (Math.max(...events.map((e) => e.year)) - divergenceYear) / 10
    : 0);

  const highImpactEvents = events.filter((e) => e.impact === 'high' || e.impact === 'critical').length;
  const topIndustries = getTopItems(companies.map((c) => c.industry), 3);
  const totalValuation = companies.reduce((sum, c) => sum + c.valuation, 0);

  return (
    <div className="grid gap-3 grid-cols-2 sm:grid-cols-4">
      <StatCard label="Décadas" value={decades} icon="📅" />
      <StatCard label="Eventos" value={events.length} icon="⚡" sublabel={`${highImpactEvents} alto impacto`} />
      <StatCard label="Empresas" value={companies.length} icon="🏢" sublabel={topIndustries.join(', ')} />
      <StatCard label="Productos" value={products.length} icon="📦" sublabel={formatCurrency(totalValuation) + ' total'} />
    </div>
  );
}

function StatCard({ label, value, icon, sublabel }: { label: string; value: number; icon: string; sublabel?: string }) {
  return (
    <Card>
      <CardContent className="p-4 text-center">
        <div className="text-2xl">{icon}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
        {sublabel && <div className="text-[10px] text-muted-foreground mt-1 truncate">{sublabel}</div>}
      </CardContent>
    </Card>
  );
}

function getTopItems(items: string[], n: number): string[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name]) => name);
}

function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}
