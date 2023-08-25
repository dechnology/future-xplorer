import { NewPersona, PersonaContext, PortraitRequestBody } from '@/types';

const getSystemMessage = (ctx: PersonaContext): string => {
  return [
    'You are tasked as a portrait master. Your role is to craft an exquisite description in English that will guide the DALLE image generation model to create the perfect portrait.',
    '',
    `These portraits are integral for "${ctx.workshop.name}", a workshop where we delve into the topic of "${ctx.issue.title}".`,
    '',
    'Workshop details:',
    "'''",
    `${ctx.workshop.description}`,
    "'''",
    '',
    'Issue details:',
    "'''",
    `${ctx.issue.description}`,
    "'''",
    '',
    'Guidelines for your response:',
    "'''",
    '1. While descriptions can be presented in various languages, your crafted portrait instructions must be in English.',
    '2. Translate non-English terms (except names) to English in your descriptions.',
    '3. Keep your response under 1000 CHARACTERS.',
    '4. Ensure the portrait focuses on the face of the persona.',
    '5. Avoid listing. Craft a cohesive paragraph.',
    '6. Portraits should depict ONLY ONE individual.',
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
