import { NextResponse } from 'next/server';
import { getTimeline } from '@/lib/store';

export async function GET(
  request: Request,
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

  const url = new URL(request.url);
  const type = url.searchParams.get('type');
  const decade = url.searchParams.get('decade');

  let companies = timeline.companies;
  let products = timeline.products;

  if (decade) {
    const d = parseInt(decade, 10);
    companies = companies.filter((c) => c.foundedYear >= d && c.foundedYear < d + 10);
    products = products.filter((p) => p.launchYear >= d && p.launchYear < d + 10);
  }

  if (type === 'companies') {
    return NextResponse.json({ data: companies });
  }
  if (type === 'products') {
    return NextResponse.json({ data: products });
  }

  return NextResponse.json({
    companies,
    products,
    total: companies.length + products.length,
  });
}
