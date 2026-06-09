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
  const name = String(entity.name ?? '');
  const foundedYear = Number(entity.foundedYear ?? 0);
  const description = String(entity.description ?? '');
  const headquarters = String(entity.headquarters ?? '');
  const valuation = Number(entity.valuation ?? 0);
  const employees = Number(entity.employees ?? 0);
  const ceo = entity.ceo as { name: string } | undefined;

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{name}</CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {foundedYear}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>📍 {headquarters}</span>
          <span>💰 {formatCurrency(valuation)}</span>
          <span>👥 {employees.toLocaleString()}</span>
        </div>
        {ceo && (
          <p className="text-xs text-muted-foreground">CEO: {ceo.name}</p>
        )}
      </CardContent>
    </Card>
  );
}

function ProductCard({ entity, onClick }: { entity: Record<string, unknown>; onClick?: () => void }) {
  const name = String(entity.name ?? '');
  const launchYear = Number(entity.launchYear ?? 0);
  const description = String(entity.description ?? '');
  const category = String(entity.category ?? '');
  const priceUSD = Number(entity.priceUSD ?? 0);
  const manufacturer = String(entity.manufacturer ?? '');

  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-tight">{name}</CardTitle>
          <Badge variant="outline" className="text-xs shrink-0">
            {launchYear}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span>📦 {category}</span>
          <span>💰 {formatCurrency(priceUSD)}</span>
          <span>🏭 {manufacturer}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function EntityCard({ type, entity, onClick }: EntityCardProps) {
  if (type === 'company') return <CompanyCard entity={entity} onClick={onClick} />;
  return <ProductCard entity={entity} onClick={onClick} />;
}
