import {
  NewCase,
  IssueContext,
  KeywordsRequestBody,
  KeywordsResponseBody,
} from '@/types';

interface GenereatedKeyword {
  body: string;
  category: string;
}

interface ProcessedKeyword extends GenereatedKeyword {
  type: 'O' | 'E' | 'M' | 'S';
}

const getSystemMessage = (ctx: IssueContext): string => {
  return [
    "'''",
    'Main task:',
    'Extract keywords from the case provided in the user prompt using the function call provided.',
    'Each keyword should be assigned to a category with the provided enums.',
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

const getFunctions = (categories: string[]) => [
  {
    name: 'extract_keywords',
    description: 'extract keywords from the case.',
    parameters: {
      type: 'object',
      properties: {
        keywords: {
          type: 'array',
          description: 'keywords of the case (eg. AI tools, healthcare)',
          items: {
            type: 'object',
            properties: {
              body: { type: 'string' },
              category: { type: 'string', enum: categories },
            },
          },
        },
      },
      required: ['keywords'],
    },
  },
];

export default defineEventHandler(
  async (event): Promise<KeywordsResponseBody> => {
    const { _case, ...ctx }: KeywordsRequestBody = await readBody(event);

    const { objects, environments, messages, services } = ctx.workshop;

    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(_case) },
      ],
      functions: getFunctions([
        ...objects,
        ...environments,
        ...messages,
        ...services,
      ]),
    });

    const message = completions.choices[0].message;

    if (!message.function_call) {
      throw new Error('no function call');
    }

    const response = JSON.parse(message.function_call.arguments) as {
      keywords: GenereatedKeyword[];
    };

    const processedKeywords: ProcessedKeyword[] = response.keywords
      .map((keyword) => {
        const { category } = keyword;

        if (objects.includes(category)) {
          return { ...keyword, type: 'O' };
        }

        if (environments.includes(category)) {
          return { ...keyword, type: 'E' };
        }

        if (messages.includes(category)) {
          return { ...keyword, type: 'M' };
        }

        if (services.includes(category)) {
          return { ...keyword, type: 'S' };
        }

        return undefined;
      })
      .filter((keyword) => keyword !== undefined) as ProcessedKeyword[];

    return { keywords: processedKeywords };
  }
);
