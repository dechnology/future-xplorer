import type {
  IssueContext,
  IllustrationPromptRequestBody,
  IllustrationPromptResponseBody,
} from '@/types';
import { getIssueConextMessage } from '~/server/utils/openai';

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
    'Description:',
  ].join('\n');
};

export default defineEventHandler(
  async (event): Promise<IllustrationPromptResponseBody> => {
    const { story, ...ctx }: IllustrationPromptRequestBody =
      await readBody(event);

    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(story) },
      ],
    });

    if (!completions.choices[0].message) {
      throw new Error(`OpenAI error: ${completions}`);
    }

    if (!completions.choices[0].message.content) {
      throw new Error(`OpenAI error: ${completions}`);
    }

    return { prompt: completions.choices[0].message.content };
  }
);
