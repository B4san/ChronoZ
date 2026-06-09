import { NextResponse } from 'next/server';
import { getTimeline } from '@/lib/store';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timeline = getTimeline(id);

  if (!timeline) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Timeline not found', statusCode: 404 } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: timeline.id,
    name: timeline.name,
    status: timeline.status,
    consistencyScore: timeline.consistencyScore,
    divergence: {
      year: timeline.divergenceYear,
      subject: timeline.divergencePoint,
      type: 'technology' as const,
      description: timeline.description,
      magnitude: 'major' as const,
    },
    stats: {
      events: timeline.events.length,
      companies: timeline.companies.length,
      products: timeline.products.length,
    },
    yearRange: {
      start: timeline.divergenceYear,
      end: timeline.divergenceYear + 100,
    },
    events: timeline.events,
    companies: timeline.companies,
    products: timeline.products,
    createdAt: timeline.createdAt.toISOString(),
    completedAt: timeline.completedAt?.toISOString(),
  });
}
