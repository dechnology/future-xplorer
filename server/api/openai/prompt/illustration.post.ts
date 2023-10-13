import type {
  IssueContext,
  IllustrationPromptRequestBody,
  PromptResponseBody,
} from '@/types';
import {
  createDallePrompt,
  getIssueConextMessage,
} from '~/server/utils/openai';

const getSystemMessage = (ctx: IssueContext): string =>
  [
    "'''",
    'Main task:',
    '1. You will be given a short story describing a scenario.',
    '2. Compose a short description UNDER 1000 CHARACTERS of an illustration that depicts the scenario.',
    '3. In the description, the order of the elements is place, decoration, lighting, the person.',
    "4. When describing the person, describe the person's whereabout, pose, expression, and clothing.",
    "'''",

    "'''",
    'Additional information:',
    getIssueConextMessage(ctx),
    "'''",
  ].join('\n');

const getUserMessage = (story: string): string => {
  return [
    "'''",
    'Story content:',
    story,
    "'''",
    'Remeber to keep your respose under 1000 CHARACTERS, and follow the order of the elements.',
  ].join('\n');
};

const functions = [
  {
    name: 'generate_illustration_prompt',
    description: 'generate an illustration prompt from the story.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description:
            "The prompt of the illustration. The order of the elements is place, decoration, lighting, the person. When describing the person, describe the person's whereabout, pose, expression, and clothing. The prompt should be under 1000 CHARACTERS. This prompt should be wriiten in English.",
        },
      },
      required: ['prompt'],
    },
  },
];

export default defineEventHandler(
  async (event): Promise<PromptResponseBody> => {
    const { story, ...ctx }: IllustrationPromptRequestBody =
      await readBody(event);

    return await createDallePrompt({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(story) },
      ],
      functions,
    });
  }
);
