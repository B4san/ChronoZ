'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { TimelineEvent } from '@/types';

const IMPACT_COLORS: Record<string, string> = {
  low: 'bg-gray-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  technology: 'Tech',
  politics: 'Política',
  economics: 'Economía',
  culture: 'Cultura',
  science: 'Ciencia',
  military: 'Militar',
};

interface EventCardProps {
  event: TimelineEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-muted/50 transition-colors"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {event.title}
          </CardTitle>
          <div className="flex gap-1 shrink-0">
            <Badge variant="outline" className="text-xs">
              {event.year}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {CATEGORY_LABELS[event.category]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${IMPACT_COLORS[event.impact]}`}
          />
          <span className="text-xs text-muted-foreground capitalize">
            Impacto: {event.impact}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
