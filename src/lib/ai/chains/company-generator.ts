import { generateObject } from 'ai';
import { models } from '../provider';
import { systemPrompt } from '../prompts/system';
import { GeneratedCompanySchema } from '@/schemas/company';
import type { DivergenceInput } from '@/schemas/divergence';
import type { GeneratedCompany } from '@/schemas/company';

export async function generateCompaniesForDecade(
  decade: number,
  divergence: DivergenceInput,
  existingCompanies: string[]
): Promise<GeneratedCompany[]> {
  const count = 2 + Math.floor(Math.random() * 4);

  const { object } = await generateObject({
    model: models.entity,
    schema: GeneratedCompanySchema.array().min(2).max(5),
    system: systemPrompt(JSON.stringify(divergence)),
    prompt: `Generate ${count} companies that would exist in this alternate timeline.

Timeline context: ${divergence.description}
Decade: ${decade}s
Existing companies to avoid duplicating: ${existingCompanies.join(', ') || 'none'}

Companies should:
- Have realistic names for the era and industry
- Be founded within the decade ${decade}-${decade + 9}
- Reflect the technology level and culture of this timeline
- Have valuations appropriate for their age and industry
- Have fictional but realistic CEOs`,
  });

  return object;
}
