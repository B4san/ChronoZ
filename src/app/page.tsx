'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DivergenceInput } from '@/components/divergence-input';
import { StreamingIndicator } from '@/components/streaming-indicator';
import { useStream } from '@/hooks/use-stream';

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleComplete = useCallback((id: string) => {
    router.push(`/timeline/${id}`);
  }, [router]);

  const handleError = useCallback((message: string) => {
    setError(message);
  }, []);

  const { phase, decade, message, isStreaming, startStream } = useStream({
    onComplete: handleComplete,
    onError: handleError,
  });

  const handleSubmit = async (divergence: string) => {
    setError(null);
    try {
      const response = await fetch('/api/v1/timelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ divergence }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error?.message ?? 'Failed to create timeline');
      }

      const data = await response.json();
      startStream(data.streamUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl space-y-6">
        {isStreaming ? (
          <>
            <StreamingIndicator phase={phase} decade={decade} message={message} />
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              Generando tu timeline alternativo...
            </p>
          </>
        ) : (
          <DivergenceInput onSubmit={handleSubmit} isLoading={isStreaming} />
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
            {error}
          </div>
        )}
      </div>
    </main>
  );
}
