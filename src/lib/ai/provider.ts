import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const openrouter = process.env.OPENROUTER_API_KEY
  ? createOpenRouter({
      apiKey: process.env.OPENROUTER_API_KEY,
      appUrl: process.env.OPENROUTER_SITE_URL,
      appName: process.env.OPENROUTER_SITE_TITLE || 'ChronoZ',
    })
  : null;

function getModel(
  openrouterModel: string,
  openaiModel: string,
  anthropicModel?: string
) {
  if (openrouter) {
    return openrouter.chat(openrouterModel);
  }
  if (anthropicModel && process.env.ANTHROPIC_API_KEY) {
    return anthropic(anthropicModel);
  }
  return openai(openaiModel);
}

export const models = {
  timeline: getModel(
    process.env.OPENROUTER_TIMELINE_MODEL || 'anthropic/claude-sonnet-4-20250514',
    'gpt-4o',
    'claude-sonnet-4-20250514'
  ),
  entity: getModel(
    process.env.OPENROUTER_ENTITY_MODEL || 'openai/gpt-4o',
    'gpt-4o'
  ),
  parser: getModel(
    process.env.OPENROUTER_PARSER_MODEL || 'openai/gpt-4o-mini',
    'gpt-4o-mini'
  ),
  fallback: getModel(
    process.env.OPENROUTER_FALLBACK_MODEL || 'openai/gpt-4o-mini',
    'gpt-4o-mini'
  ),
} as const;

export type ModelKey = keyof typeof models;

export function getProviderInfo() {
  if (openrouter) {
    return { provider: 'openrouter', mode: 'unified' };
  }
  if (process.env.ANTHROPIC_API_KEY) {
    return { provider: 'anthropic+openai', mode: 'direct' };
  }
  return { provider: 'openai', mode: 'direct' };
}
