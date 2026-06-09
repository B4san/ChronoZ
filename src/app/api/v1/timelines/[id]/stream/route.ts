import { getTimeline, updateTimeline, addEventsToTimeline, addCompaniesToTimeline, addProductsToTimeline } from '@/lib/store';
import { generateDecadeEvents } from '@/lib/ai/chains/timeline-generator';
import { generateCompaniesForDecade } from '@/lib/ai/chains/company-generator';
import { generateProductsForDecade } from '@/lib/ai/chains/product-generator';
import { generateId } from '@/lib/store';
import type { TimelineEvent, Company, Product } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const timeline = getTimeline(id);

  if (!timeline) {
    return new Response(JSON.stringify({ error: 'Timeline not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        send('phase', { phase: 'parsing', message: 'Analyzing divergence point...' });

        const divergence = {
          year: timeline.divergenceYear,
          subject: timeline.divergencePoint,
          type: 'technology' as const,
          description: timeline.description,
          magnitude: 'major' as const,
        };

        send('parsed', divergence);

        const startYear = timeline.divergenceYear;
        const endYear = startYear + 100;
        let previousContext = '';
        const existingCompanies: string[] = [];
        const existingProducts: string[] = [];

        for (let decade = startYear; decade < endYear; decade += 10) {
          send('phase', { phase: 'generating', decade, message: `Generating ${decade}s...` });

          // Generate events
          const decadeResult = await generateDecadeEvents(decade, divergence, previousContext);
          const events: TimelineEvent[] = decadeResult.events.map((e) => ({
            id: generateId('ev'),
            timelineId: id,
            ...e,
          }));
          addEventsToTimeline(id, events);
          send('events', { decade, data: events });

          // Generate companies
          const companies = await generateCompaniesForDecade(decade, divergence, existingCompanies);
          const companyEntities: Company[] = companies.map((c) => ({
            id: generateId('co'),
            timelineId: id,
            ...c,
          }));
          addCompaniesToTimeline(id, companyEntities);
          existingCompanies.push(...companies.map((c) => c.name));
          send('companies', { decade, data: companyEntities });

          // Generate products
          const products = await generateProductsForDecade(decade, divergence, existingProducts, existingCompanies);
          const productEntities: Product[] = products.map((p) => ({
            id: generateId('pr'),
            timelineId: id,
            ...p,
          }));
          addProductsToTimeline(id, productEntities);
          existingProducts.push(...products.map((p) => p.name));
          send('products', { decade, data: productEntities });

          previousContext += `\nDecade ${decade}s: ${decadeResult.decadeSummary}`;
        }

        updateTimeline(id, {
          status: 'completed',
          consistencyScore: 0.88,
          completedAt: new Date(),
        });

        send('complete', {
          timelineId: id,
          totalEvents: timeline.events.length,
        });

        controller.close();
      } catch (error) {
        console.error('Stream error:', error);
        const message = error instanceof Error ? error.message : 'Generation failed';
        updateTimeline(id, { status: 'failed' });
        controller.enqueue(
          encoder.encode(`event: error\ndata: ${JSON.stringify({ message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
