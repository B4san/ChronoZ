import { NextResponse } from 'next/server';
import { getProviderInfo } from '@/lib/ai/provider';

export async function GET() {
  const info = getProviderInfo();
  return NextResponse.json({
    status: 'ok',
    provider: info.provider,
    mode: info.mode,
    timestamp: new Date().toISOString(),
  });
}
