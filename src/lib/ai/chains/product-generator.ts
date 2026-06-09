import { generateObject } from 'ai';
import { models } from '../provider';
import { systemPrompt } from '../prompts/system';
import { GeneratedProductSchema } from '@/schemas/product';
import type { DivergenceInput } from '@/schemas/divergence';
import type { GeneratedProduct } from '@/schemas/product';

export async function generateProductsForDecade(
  decade: number,
  divergence: DivergenceInput,
  existingProducts: string[],
  existingCompanies: string[]
): Promise<GeneratedProduct[]> {
  const count = 2 + Math.floor(Math.random() * 3);

  const { object } = await generateObject({
    model: models.entity,
    schema: GeneratedProductSchema.array().min(2).max(4),
    system: systemPrompt(JSON.stringify(divergence)),
    prompt: `Generate ${count} products that would exist in this alternate timeline.

Timeline context: ${divergence.description}
Decade: ${decade}s
Existing products to avoid duplicating: ${existingProducts.join(', ') || 'none'}
Available manufacturers: ${existingCompanies.join(', ') || 'generate new company names'}

Products should:
- Have catchy, era-appropriate names
- Be launched within the decade ${decade}-${decade + 9}`
  });

  return object;
}
