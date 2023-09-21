import {
  IssueContext,
  Story,
  StoryCombineRequestBody,
  StoryResponseBody,
} from '@/types';

const getSystemMessage = (ctx: IssueContext): string => {
  return [
    "'''",
    'Main task:',
    '1. You will be given multiple short stories describing different scenarios.',
    '\tEach story will be composed of the persona (P), object (O), environment (E), message (M), and service (S).',
    '2. Extract the persona (P), object (O), environment (E), message (M), and service (S) from each story.',
    '3. Pick one P from one of the stories.',
    '4. Pick one O from one of the stories.',
    '5. Pick one E from one of the stories.',
    '6. Pick one M from one of the stories.',
    '7. Pick one S from one of the stories.',
    '8. Compose a new short story describing the scenario based on the new POEMS.',
    "'''",

    "'''",
    'Additional information:',
    `The scenario given is from a workshop called "Workshop: ${ctx.workshop.name}".`,
    'Here are the details of the workshop:',
    ctx.workshop.description,
    `The current issue discussed in the workshop is called "${ctx.issue.title}".`,
    'Here are the details of the issue:',
    ctx.issue.description,
    "'''",
  ].join('\n');
};

const getUserMessage = (stories: Pick<Story, 'title' | 'content'>[]): string =>
  stories
    .flatMap(({ title, content }, idx) => [
      "'''",
      `Story ${idx} - ${title}`,
      content,
      ',,,',
    ])
    .join('\n');

export default defineEventHandler(async (event): Promise<StoryResponseBody> => {
  const { workshop, issue, stories }: StoryCombineRequestBody =
    await readBody(event);

  const completions = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemMessage({ workshop, issue }) },
      { role: 'user', content: getUserMessage(stories) },
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
