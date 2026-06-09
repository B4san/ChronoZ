'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ConsistencyIssue {
  type: string;
  severity: string;
  message: string;
}

interface ConsistencyData {
  score: number;
  totalChecks: number;
  passedChecks: number;
  issues: ConsistencyIssue[];
}

export function ConsistencyPanel({ timelineId }: { timelineId: string }) {
  const [data, setData] = useState<ConsistencyData | null>(null);

  useEffect(() => {
    fetch(`/api/v1/timelines/${timelineId}/consistency`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [timelineId]);

  if (!data) return null;

  const scorePercent = Math.round(data.score * 100);
  const scoreColor =
    scorePercent >= 90 ? 'text-green-600' :
    scorePercent >= 70 ? 'text-yellow-600' : 'text-red-600';

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Motor de Consistencia</CardTitle>
          <span className={`text-2xl font-bold ${scoreColor}`}>
            {scorePercent}%
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">
          {data.passedChecks}/{data.totalChecks} verificaciones pasadas
        </p>

        {data.issues.length > 0 && (
          <div className="space-y-2">
            {data.issues.slice(0, 5).map((issue, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <Badge
                  variant={issue.severity === 'error' ? 'destructive' : 'secondary'}
                  className="text-[10px] shrink-0"
                >
                  {issue.type}
                </Badge>
                <span className="text-muted-foreground">{issue.message}</span>
              </div>
            ))}
            {data.issues.length > 5 && (
              <p className="text-xs text-muted-foreground">
                +{data.issues.length - 5} más...
              </p>
            )}
          </div>
        )}

        {data.issues.length === 0 && (
          <p className="text-xs text-green-600">
            ✓ Sin problemas de consistencia detectados
          </p>
        )}
      </CardContent>
    </Card>
  );
}
