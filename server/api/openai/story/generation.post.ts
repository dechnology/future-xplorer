import {
  IssueContext,
  StoryRequestBody,
  StoryResponseBody,
  StoryContext,
} from '@/types';
import { getIssueConextMessage } from '~/server/utils/openai';

const getSystemMessage = (ctx: IssueContext): string => {
  return [
    "'''",
    'Main task:',
    'You will be given the context of the scenario, which includes the persona, object, environment, message, and service.',
    'The persona is the main character of the story.',
    'The object is the object that the persona is interacting with.',
    'The environment is the environment that the persona is in.',
    'The message is the message that the persona is trying to convey.',
    'The service is the service that the persona is trying to use.',
    'Compose a short story describing the scenario.',
    "'''",

    "'''",
    'Additional information:',
    getIssueConextMessage(ctx),
    "'''",
  ].join('\n');
};

const getUserMessage = (ctx: StoryContext): string => {
  if (!ctx.persona) {
    throw new Error('no persona');
  }

  let personaDesc = `persona: This individual is a ${ctx.persona.age} ${ctx.persona.gender} with the role of ${ctx.persona.role}. This persona is characterized by the trait: ${ctx.persona.trait}.`;

  if (ctx.persona.other && ctx.persona.other.trim() !== '') {
    personaDesc += ` Additional information: ${ctx.persona.other}`;
  }

  return [
    "'''",
    'Story context:',
    `persona: ${personaDesc}`,
    `object: ${ctx.object}`,
    `environment: ${ctx.environment}`,
    `message: ${ctx.message}`,
    `service: ${ctx.service}`,
    "'''",
  ].join('\n');
};

export default defineEventHandler(async (event): Promise<StoryResponseBody> => {
  const { workshop, issue, ...storyCtx }: StoryRequestBody =
    await readBody(event);

  const completions = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemMessage({ workshop, issue }) },
      { role: 'user', content: getUserMessage(storyCtx) },
    ],
  });

  if (!completions.choices[0].message) {
    throw new Error(`OpenAI error: ${completions}`);
  }

  if (!completions.choices[0].message.content) {
    throw new Error(`OpenAI error: ${completions}`);
  }

  return { story: completions.choices[0].message.content };
});
