import type {
  IssueContext,
  StoryRemakeRequestBody,
  StoryResponseBody,
} from '@/types';
import { getIssueConextMessage } from '~/server/utils/openai';

const getSystemMessage = (ctx: IssueContext): string =>
  [
    "'''",
    'Main task:',
    '1. You will be given a short story describing a scenario.',
    '\tThe story will be composed of the persona (P), object (O), environment (E), message (M), and service (S).',
    '2. Extract the persona (P), object (O), environment (E), message (M), and service (S) from the story.',
    '3. Replace one of the P, O, E, M, or S with a new relevant element.',
    '4. Compose a new short story describing the scenario based on the new POEMS.',
    "'''",

    "'''",
    'Additional information:',
    getIssueConextMessage(ctx),
    "'''",
  ].join('\n');

const getUserMessage = (content: string): string => {
  return ["'''", 'Story content:', content, "'''"].join('\n');
};

const functions = [
  {
    name: 'remake_story',
    description: 'recompose a story from the given story.',
    parameters: {
      type: 'object',
      properties: {
        story: {
          type: 'object',
          description:
            'The reamke story from the given story. The new story MUST BE a completely original story, not a copy of the original story.',
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
  const { workshop, issue, content }: StoryRemakeRequestBody =
    await readBody(event);

  const completions = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemMessage({ workshop, issue }) },
      { role: 'user', content: getUserMessage(content) },
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
