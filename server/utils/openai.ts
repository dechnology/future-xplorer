import OpenAI from 'openai';

const { openaiApiKey } = useRuntimeConfig();

export const openai = new OpenAI({ apiKey: openaiApiKey });
