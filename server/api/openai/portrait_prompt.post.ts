import { NewPersona, IssueContext, PortraitRequestBody } from '@/types';

const getSystemMessage = (ctx: IssueContext): string => {
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
    '2. Translate non-English terms to English in your descriptions.',
    '3. Keep your response under 1000 CHARACTERS.',
    '4. Ensure the portrait focuses on the face of the persona.',
    '5. Avoid listing. Craft a cohesive paragraph.',
    '6. Portraits should depict ONLY ONE individual.',
    "'''",
  ].join('\n');
};

const getUserMessage = (p: NewPersona): string => {
  const ageDescription =
    typeof p.age === 'number' ? `${p.age}-year-old` : p.age;

  const baseMessage = [
    'Persona details:',
    "'''",
    `This individual is a ${ageDescription} ${p.gender} with the role of ${p.role}.`,
    `They are characterized by the trait: ${p.trait}.`,
  ];

  if (p.other && p.other.trim() !== '') {
    baseMessage.push(`Additional information: ${p.other}`);
  }

  baseMessage.push("'''");

  return baseMessage.join('\n');
};

export default defineEventHandler(
  async (event): Promise<{ prompt: string }> => {
    const { persona, ...ctx }: PortraitRequestBody = await readBody(event);

    const completions = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(persona) },
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
