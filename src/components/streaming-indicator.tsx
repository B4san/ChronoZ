'use client';

import { Badge } from '@/components/ui/badge';

interface StreamingIndicatorProps {
  phase: string;
  decade?: number;
  message?: string;
}

const PHASE_LABELS: Record<string, string> = {
  parsing: 'Analizando punto de divergencia...',
  generating: 'Generando eventos...',
  validating: 'Validando consistencia...',
  complete: 'Completado',
};

export function StreamingIndicator({ phase, decade, message }: StreamingIndicatorProps) {
  if (phase === 'complete') return null;

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 animate-pulse">
      <div className="h-3 w-3 rounded-full bg-primary animate-spin" />
      <div className="flex-1">
        <p className="text-sm font-medium">
          {message || PHASE_LABELS[phase] || phase}
        </p>
        {decade !== undefined && (
          <p className="text-xs text-muted-foreground">
            Década: {decade}s
          </p>
        )}
      </div>
      <Badge variant="secondary" className="text-xs">
        {phase}
      </Badge>
    </div>
  );
}
