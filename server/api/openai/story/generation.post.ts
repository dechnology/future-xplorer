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
    'Compose a short story describing the scenario with the given function call.',
    'The story should be written in the language of the given context.',
    'The length of the story content is preferbly 400 characters long.',
    'But it should be at least 250 characters long.',
    'The title of the story should be based on the content of the story.',
    '',
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

  let personaDesc = `persona: ${ctx.persona.name} is a ${ctx.persona.age} ${ctx.persona.gender} with the role of ${ctx.persona.role}. This persona is characterized by the trait: ${ctx.persona.trait}.`;

  if (ctx.persona.other && ctx.persona.other.trim() !== '') {
    personaDesc += ` Additional information: ${ctx.persona.other}`;
  }

  const userMessage = [
    "'''",
    'Story context:',
    `persona: ${personaDesc}`,
    `object: ${ctx.object}`,
    `environment: ${ctx.environment}`,
    `message: ${ctx.message}`,
    `service: ${ctx.service}`,
    "'''",
  ].join('\n');

  console.log(userMessage);

  return userMessage;
};

const functions = [
  {
    name: 'generate_story',
    description: 'generate a story from the context of the scenario.',
    parameters: {
      type: 'object',
      properties: {
        story: {
          type: 'object',
          description: 'The generated story from the context of the scenario.',
          properties: {
            title: {
              type: 'string',
              description:
                'title of the story. This should be based on the content of the story. DO NOT use the issue or workshop title as the title of the story.',
            },
            content: {
              type: 'string',
              description:
                'content of the story. This should be at least 400 characters long, preferbly over 250 characters.',
            },
          },
        },
      },
      required: ['story'],
    },
  },
];

export default defineEventHandler(async (event): Promise<StoryResponseBody> => {
  const { workshop, issue, ...storyCtx }: StoryRequestBody =
    await readBody(event);

  const completions = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemMessage({ workshop, issue }) },
      { role: 'user', content: getUserMessage(storyCtx) },
    ],
    functions,
  });

  const message = completions.choices[0].message;

  if (!message.function_call) {
    throw new Error('no function call');
  }

  const parsedArguments = JSON.parse(message.function_call.arguments);

  console.log(parsedArguments);

  return parsedArguments as StoryResponseBody;
});
