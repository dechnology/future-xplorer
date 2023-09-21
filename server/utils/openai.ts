import { OpenAI } from 'openai';
import { IssueContext } from '~/types';

const { openaiApiKey } = useRuntimeConfig();

export const openai = new OpenAI({ apiKey: openaiApiKey });

export const getIssueConextMessage = (ctx: IssueContext): string =>
  [
    `The scenario given is from a workshop called "Workshop: ${ctx.workshop.name}".`,
    'Here are the details of the workshop:',
    ctx.workshop.description,
    `The current issue discussed in the workshop is called "${ctx.issue.title}".`,
    'Here are the details of the issue:',
    ctx.issue.description,
  ].join('\n');
