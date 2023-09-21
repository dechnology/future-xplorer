import {
  IssueContext,
  StoryRemakeRequestBody,
  StoryResponseBody,
} from '@/types';

const getSystemMessage = (ctx: IssueContext): string => {
  return [
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
    `The scenario given is from a workshop called "Workshop: ${ctx.workshop.name}".`,
    'Here are the details of the workshop:',
    ctx.workshop.description,
    `The current issue discussed in the workshop is called "${ctx.issue.title}".`,
    'Here are the details of the issue:',
    ctx.issue.description,
    "'''",
  ].join('\n');
};

const getUserMessage = (content: string): string => {
  return ["'''", 'Story content:', content, "'''"].join('\n');
};

export default defineEventHandler(async (event): Promise<StoryResponseBody> => {
  const { workshop, issue, content }: StoryRemakeRequestBody =
    await readBody(event);

  const completions = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: getSystemMessage({ workshop, issue }) },
      { role: 'user', content: getUserMessage(content) },
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
