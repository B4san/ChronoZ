'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const EXAMPLES = [
  'Internet inventado en 1950',
  'Tesla nunca existió',
  'Los dinosaurios nunca se extinguen',
  'La imprenta en el Imperio Romano',
  'No ocurre la Segunda Guerra Mundial',
];

interface DivergenceInputProps {
  onSubmit: (divergence: string) => void;
  isLoading?: boolean;
}

export function DivergenceInput({ onSubmit, isLoading }: DivergenceInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim().length >= 10) {
      onSubmit(value.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">
          Chronos Engine
        </h1>
        <p className="text-muted-foreground text-lg">
          Motor Procedural de Civilizaciones Alternativas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="¿Qué habría pasado si...?"
            className="h-14 text-lg px-6"
            disabled={isLoading}
          />
        </div>
        <Button
          type="submit"
          className="w-full h-12 text-lg"
          disabled={value.trim().length < 10 || isLoading}
        >
          {isLoading ? 'Generando...' : 'Crear Timeline'}
        </Button>
      </form>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground text-center">Ejemplos:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map((example) => (
            <Button
              key={example}
              variant="outline"
              size="sm"
              onClick={() => { setValue(example); }}
              disabled={isLoading}
              className="text-xs"
            >
              {example}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
