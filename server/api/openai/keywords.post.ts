import {
  NewCase,
  IssueContext,
  KeywordsRequestBody,
  KeywordsResponseBody,
} from '@/types';

const getSystemMessage = (ctx: IssueContext): string => {
  return [
    "'''",
    'Main task:',
    'Extract keywords from the case provided in the user prompt using the function call provided.',
    'Relevant words not appearing in the context can also be keywords.',
    "'''",

    "'''",
    'Additional information:',
    getIssueConextMessage(ctx),
    "'''",
  ].join('\n');
};

const getUserMessage = (c: NewCase): string => {
  return [
    "'''",
    'Case description:',
    `title: ${c.title}`,
    `background: ${c.background}`,
    `method: ${c.method}`,
    `goal: ${c.goal}`,
    `challenge: ${c.challenge}`,
    `result: ${c.result}`,
    `other: ${c.other}`,
    "'''",
  ].join('\n');
};

const functions = [
  {
    name: 'extract_keywords',
    description: 'extract keywords from the case.',
    parameters: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          description: 'keywords of the case (eg. AI tools, healthcare)',
          items: { type: 'string' },
        },
      },
      required: ['keywords'],
    },
  },
];

export default defineEventHandler(
  async (event): Promise<KeywordsResponseBody> => {
    const { _case, ...ctx }: KeywordsRequestBody = await readBody(event);

    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(_case) },
      ],
      functions,
    });

    const message = completions.choices[0].message;

    if (!message.function_call) {
      throw new Error('no function call');
    }

    const keywords = JSON.parse(message.function_call.arguments);

    return keywords as KeywordsResponseBody;
  }
);
