import { generateObject } from 'ai';
import { models } from '../provider';
import { DivergenceInputSchema } from '@/schemas/divergence';
import type { DivergenceInput } from '@/schemas/divergence';

export async function parseDivergence(input: string): Promise<DivergenceInput> {
  const { object } = await generateObject({
    model: models.parser,
    schema: DivergenceInputSchema,
    prompt: `Parse this alternate history scenario into structured data.

User input: "${input}"

Extract:
- year: The year of divergence (or infer a reasonable year if not specified)
- subject: What changed (e.g., "internet", "nuclear energy")
- type: The category of change
- description: The full description as provided
- magnitude: How significant is this change

If the user doesn't specify a year, choose a historically appropriate year for the subject.`,
  });

  return object;
}
