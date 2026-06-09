import { generateObject } from 'ai';
import { models } from '../provider';
import { systemPrompt } from '../prompts/system';
import { DecadeEventsSchema } from '@/schemas/event';
import type { DivergenceInput } from '@/schemas/divergence';
import type { DecadeEvents } from '@/schemas/event';

export async function generateDecadeEvents(
  decade: number,
  divergence: DivergenceInput,
  previousContext: string = ''
): Promise<DecadeEvents> {
  const { object } = await generateObject({
    model: models.timeline,
    schema: DecadeEventsSchema,
    system: systemPrompt(JSON.stringify(divergence)),
    prompt: `Generate events for the decade ${decade}-${decade + 9}.

Divergence: ${divergence.description}
Type: ${divergence.type}
Magnitude: ${divergence.magnitude}

${previousContext ? `Previous decades context:\n${previousContext}` : 'This is the first decade after the divergence point.'}

Generate 3-8 events that would realistically occur in this decade as a consequence of the divergence.
Each event should have causal connections to the divergence or to previous events.
Include a mix of direct consequences and emergent effects.

Event years should be within the decade range ${decade}-${decade + 9}.`,
  });

  return object;
}
