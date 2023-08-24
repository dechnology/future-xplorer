import { NewPersona, PersonaContext, PortraitRequestBody } from '@/types';

const getSystemMessage = (ctx: PersonaContext): string => {
  return [
    'In the workshop called ',
    'You are a portrait master and your job is to generate perfect description for generating portrait in English.',
    'The description will be used as the input prompt for DALLE (an image generation model).',
    'Therefore, you must describe the scene as detailed as possible.',
    '',
    `Portraits generated will be used in a workshop named "${ctx.workshop.name}".`,
    'Here is the description for the workshop:',
    "'''",
    `${ctx.workshop.description}`,
    "'''",
    '',
    `In this workshop, we are discussing an issue called "${ctx.issue.title}".`,
    'Here is the description for the issue:',
    "'''",
    `${ctx.issue.description}`,
    "'''",
    '',
    'Rules: ',
    "'''",
    '1. The descriptions may be given in other languages (ex. Traditional Chinese),',
    'but however, you must give responses in English.',
    '2. Descriptions other than "name" from other languages must all be translated accrodingly to English.',
    '3. The response should be not exceed 400 words.',
    '4. The response you give must be such that the portrait contains the face of the persona.',
    '5. The responses must not be in list format. Write a short paragraphs as responses',
    '6. The portrait can only contain ONE PERSON.',
    "'''",
  ].join('\n');
};

const getUserMessage = (p: NewPersona): string => {
  return [
    'The persona description:',
    "'''",
    `name: ${p.name}`,
    `age: ${p.age}`,
    `gender: ${p.gender}`,
    `role: ${p.role}`,
    `trait: ${p.trait}`,
    `other: ${p.other}`,
    "'''",
  ].join('\n');
};

export default defineEventHandler(
  async (event): Promise<{ prompt: string }> => {
    const openai = useNitroApp().openai;
    const { persona, ...ctx }: PortraitRequestBody = await readBody(event);

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(persona) },
      ],
    });

    if (!response.data.choices[0].message) {
      throw new Error(`OpenAI error: ${response}`);
    }

    if (!response.data.choices[0].message.content) {
      throw new Error(`OpenAI error: ${response}`);
    }

    return { prompt: response.data.choices[0].message.content };
  }
);
