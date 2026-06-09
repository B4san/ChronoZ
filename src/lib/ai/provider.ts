import { openai } from '@ai-sdk/openai';
import { anthropic } from '@ai-sdk/anthropic';

export const models = {
  timeline: anthropic('claude-sonnet-4-20250514'),
  entity: openai('gpt-4o'),
  parser: openai('gpt-4o-mini'),
  fallback: openai('gpt-4o-mini'),
} as const;

export type ModelKey = keyof typeof models;
