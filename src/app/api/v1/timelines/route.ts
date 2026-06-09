import { NextResponse } from 'next/server';
import { createTimeline, listTimelines } from '@/lib/store';
import { parseDivergence } from '@/lib/ai/chains/divergence-parser';

export async function GET() {
  const timelines = listTimelines();
  return NextResponse.json({ data: timelines });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { divergence } = body;

    if (!divergence || typeof divergence !== 'string' || divergence.length < 10) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Divergence must be at least 10 characters', statusCode: 400 } },
        { status: 400 }
      );
    }

    const parsed = await parseDivergence(divergence);

    const timeline = createTimeline({
      name: divergence,
      divergenceYear: parsed.year,
      divergencePoint: parsed.description,
      description: divergence,
    });

    return NextResponse.json({
      id: timeline.id,
      status: timeline.status,
      divergence: parsed,
      streamUrl: `/api/v1/timelines/${timeline.id}/stream`,
      createdAt: timeline.createdAt.toISOString(),
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating timeline:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Failed to create timeline', statusCode: 500 } },
      { status: 500 }
    );
  }
}
