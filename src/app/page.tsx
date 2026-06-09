'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DivergenceInput } from '@/components/divergence-input';
import { StreamingIndicator } from '@/components/streaming-indicator';
import { useStream } from '@/hooks/use-stream';

export default function HomePage() {
  const router = useRouter();
  const handleComplete = useCallback((id: string) => {
    router.push(`/timeline/${id}`);
  }, [router]);

  const handleError = useCallback((message: string) => {
    console.error('Stream error:', message);
  }, []);

  const { phase, decade, message, isStreaming, startStream } = useStream({
    onComplete: handleComplete,
    onError: handleError,
  });

  const handleSubmit = async (divergence: string) => {
    try {
      const response = await fetch('/api/v1/timelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ divergence }),
      });

      if (!response.ok) {
        throw new Error('Failed to create timeline');
      }

      const data = await response.json();
      startStream(data.streamUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      {isStreaming ? (
        <div className="w-full max-w-2xl space-y-6">
          <StreamingIndicator phase={phase} decade={decade} message={message} />
          <p className="text-center text-muted-foreground">
            Generando tu timeline alternativo...
          </p>
        </div>
      ) : (
        <DivergenceInput onSubmit={handleSubmit} isLoading={isStreaming} />
      )}
    </main>
  );
}
