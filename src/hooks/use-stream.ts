'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface StreamEvent {
  type: string;
  phase?: string;
  decade?: number;
  data?: unknown;
  message?: string;
  timelineId?: string;
  totalEvents?: number;
}

interface UseStreamOptions {
  onEvent?: (event: StreamEvent) => void;
  onComplete?: (timelineId: string) => void;
  onError?: (message: string) => void;
}

export function useStream({ onEvent, onComplete, onError }: UseStreamOptions = {}) {
  const [phase, setPhase] = useState<string>('');
  const [decade, setDecade] = useState<number | undefined>();
  const [message, setMessage] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback((streamUrl: string) => {
    setIsStreaming(true);
    setPhase('connecting');
    setMessage('Connecting...');

    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener('phase', (e) => {
      const data = JSON.parse(e.data);
      setPhase(data.phase);
      setDecade(data.decade);
      setMessage(data.message || '');
      onEvent?.({ type: 'phase', ...data });
    });

    es.addEventListener('parsed', (e) => {
      const data = JSON.parse(e.data);
      onEvent?.({ type: 'parsed', data });
    });

    es.addEventListener('events', (e) => {
      const data = JSON.parse(e.data);
      onEvent?.({ type: 'events', ...data });
    });

    es.addEventListener('companies', (e) => {
      const data = JSON.parse(e.data);
      onEvent?.({ type: 'companies', ...data });
    });

    es.addEventListener('products', (e) => {
      const data = JSON.parse(e.data);
      onEvent?.({ type: 'products', ...data });
    });

    es.addEventListener('complete', (e) => {
      const data = JSON.parse(e.data);
      setPhase('complete');
      setIsStreaming(false);
      onEvent?.({ type: 'complete', ...data });
      onComplete?.(data.timelineId);
      es.close();
    });

    es.addEventListener('error', (e) => {
      const data = JSON.parse((e as MessageEvent).data || '{}');
      setPhase('error');
      setIsStreaming(false);
      onError?.(data.message || 'Stream error');
      es.close();
    });

    es.onerror = () => {
      setPhase('error');
      setIsStreaming(false);
      onError?.('Connection lost');
      es.close();
    };
  }, [onEvent, onComplete, onError]);

  useEffect(() => {
    return () => {
      eventSourceRef.current?.close();
    };
  }, []);

  return { phase, decade, message, isStreaming, startStream };
}
