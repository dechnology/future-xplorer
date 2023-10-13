import {
  NewPersona,
  IssueContext,
  PortraitRequestBody,
  PromptResponseBody,
} from '@/types';
import {
  createDallePrompt,
  getIssueConextMessage,
} from '~/server/utils/openai';

const getSystemMessage = (ctx: IssueContext): string => {
  return [
    'Main task:',
    'You are tasked as a portrait master. Your role is to craft an exquisite description in English that will guide the DALLE image generation model to create the perfect portrait.',

    "'''",
    'Additional information:',
    getIssueConextMessage(ctx),
    "'''",

    "'''",
    'Guidelines for your response:',
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
  const baseMessage = [
    'Persona details:',
    "'''",
    `This individual is a ${p.age} ${p.gender} with the role of ${p.role}.`,
    `They are characterized by the trait: ${p.trait}.`,
  ];

  if (p.other && p.other.trim() !== '') {
    baseMessage.push(`Additional information: ${p.other}`);
  }

  return baseMessage.join('\n');
};

const functions = [
  {
    name: 'generate_portrait_prompt',
    description: 'generate an portrait prompt from the persona details.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description:
            "The prompt of the portrait. The order of the elements is place, decoration, lighting, the person. When describing the person, describe the person's whereabout, pose, expression, and clothing. The prompt should be under 1000 CHARACTERS. This prompt should be wriiten in English. Ensure the portrait focuses on the face of the persona. The portrait should depict ONLY ONE individual.",
        },
      },
      required: ['prompt'],
    },
  },
];

export default defineEventHandler(
  async (event): Promise<PromptResponseBody> => {
    const { persona, ...ctx }: PortraitRequestBody = await readBody(event);

    return await createDallePrompt({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: getSystemMessage(ctx) },
        { role: 'user', content: getUserMessage(persona) },
      ],
      functions,
    });
  }
);
