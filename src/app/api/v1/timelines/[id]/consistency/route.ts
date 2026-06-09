import { NextResponse } from 'next/server';
import { getTimeline } from '@/lib/store';
import { validateTimeline } from '@/lib/consistency';

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

  const result = validateTimeline(timeline);

  return NextResponse.json({
    timelineId: id,
    score: result.score,
    totalChecks: result.totalChecks,
    passedChecks: result.passedChecks,
    issues: result.issues,
  });
}
