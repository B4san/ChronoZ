'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

type EntityType = 'company' | 'product';

interface EntityCardProps {
  type: EntityType;
  entity: Record<string, unknown>;
  onClick?: () => void;
}

function formatCurrency(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  return `$${value.toLocaleString()}`;
}

function CompanyCard({ entity, onClick }: { entity: Record<string, unknown>; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {entity.name as string}
          </CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {entity.foundedYear as number}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {entity.description as string}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>📍 {entity.headquarters as string}</span>
          <span>💰 {formatCurrency(entity.valuation as number)}</span>
          <span>👥 {(entity.employees as number)?.toLocaleString()}</span>
        </div>
        {entity.ceo && (
          <p className="text-xs text-muted-foreground">
            CEO: {(entity.ceo as { name: string }).name}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ProductCard({ entity, onClick }: { entity: Record<string, unknown>; onClick?: () => void }) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">
            {entity.name as string}
          </CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {entity.launchYear as number}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {entity.description as string}
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>📦 {entity.category as string}</span>
          <span>💰 {formatCurrency(entity.priceUSD as number)}</span>
          <span>🏭 {entity.manufacturer as string}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EntityCard({ type, entity, onClick }: EntityCardProps) {
  if (type === 'company') return <CompanyCard entity={entity} onClick={onClick} />;
  return <ProductCard entity={entity} onClick={onClick} />;
}
