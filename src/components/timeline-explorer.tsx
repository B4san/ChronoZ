'use client';

import { EventCard } from './event-card';
import { EntityCard } from './entity-card';
import { Badge } from '@/components/ui/badge';
import type { TimelineEvent, Company, Product } from '@/types';

interface TimelineExplorerProps {
  events: TimelineEvent[];
  companies: Company[];
  products: Product[];
}

export function TimelineExplorer({ events, companies, products }: TimelineExplorerProps) {
  const decades = Array.from(
    new Set(events.map((e) => Math.floor(e.year / 10) * 10))
  ).sort((a, b) => a - b);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <Badge variant="secondary">{events.length}</Badge> eventos
        </span>
        <span className="flex items-center gap-1">
          <Badge variant="secondary">{companies.length}</Badge> empresas
        </span>
        <span className="flex items-center gap-1">
          <Badge variant="secondary">{products.length}</Badge> productos
        </span>
      </div>

      {decades.map((decade) => {
        const decadeEvents = events.filter(
          (e) => e.year >= decade && e.year < decade + 10
        );
        const decadeCompanies = companies.filter(
          (c) => c.foundedYear >= decade && c.foundedYear < decade + 10
        );
        const decadeProducts = products.filter(
          (p) => p.launchYear >= decade && p.launchYear < decade + 10
        );

        return (
          <div key={decade} className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{decade}s</h2>
              <div className="h-px flex-1 bg-border" />
            </div>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {decadeEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {decadeCompanies.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Empresas Fundadas
                </h3>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {decadeCompanies.map((company) => (
                    <EntityCard
                      key={company.id}
                      type="company"
                      entity={company as unknown as Record<string, unknown>}
                    />
                  ))}
                </div>
              </div>
            )}

            {decadeProducts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Productos Lanzados
                </h3>
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {decadeProducts.map((product) => (
                    <EntityCard
                      key={product.id}
                      type="product"
                      entity={product as unknown as Record<string, unknown>}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
