import { OpenAI } from 'openai';
import { ChatCompletionCreateParamsNonStreaming } from 'openai/resources/chat';
import { IssueContext, PromptResponseBody } from '~/types';

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

export const createDallePrompt = async (
  body: ChatCompletionCreateParamsNonStreaming
) => {
  const completions = await openai.chat.completions.create(body);

  const message = completions.choices[0].message;

  if (!message.function_call) {
    throw new Error('no function call');
  }

  const parsedArguments: PromptResponseBody = JSON.parse(
    message.function_call.arguments
  );

  if (parsedArguments.prompt.length > 1000) {
    parsedArguments.prompt = parsedArguments.prompt.slice(0, 1000);
    console.error('The prompt is too long adn therefore truncated.');
  }

  console.log(parsedArguments);

  return parsedArguments as PromptResponseBody;
};
