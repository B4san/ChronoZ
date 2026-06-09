import { createOpenRouter } from '@openrouter/ai-sdk-provider';

const DEFAULT_MODEL = 'openrouter/auto';

function getOpenRouter() {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is required. Get one at https://openrouter.ai/keys');
  }
  return createOpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY,
    appUrl: process.env.OPENROUTER_SITE_URL,
    appName: process.env.OPENROUTER_SITE_TITLE || 'ChronoZ',
  });
}

export const models = {
  get timeline() { return getOpenRouter().chat(process.env.OPENROUTER_TIMELINE_MODEL || DEFAULT_MODEL); },
  get entity() { return getOpenRouter().chat(process.env.OPENROUTER_ENTITY_MODEL || DEFAULT_MODEL); },
  get parser() { return getOpenRouter().chat(process.env.OPENROUTER_PARSER_MODEL || DEFAULT_MODEL); },
  get fallback() { return getOpenRouter().chat(DEFAULT_MODEL); },
} as const;

export type ModelKey = keyof typeof models;

export function getProviderInfo() {
  return {
    provider: 'openrouter',
    mode: 'unified',
    model: DEFAULT_MODEL,
    hasKey: !!process.env.OPENROUTER_API_KEY,
  };
}
