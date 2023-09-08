import { z } from 'zod';
import { Base, Issue, NewPersonaSchema, Persona } from '@/types';
import mongoose from 'mongoose';

export const NewPoemsTemplateSchema = z.object({
  title: z.string().trim().nonempty(),
  content: z.string().trim().nonempty(),
  persona: z.union([
    z.string().refine((val: string) => mongoose.Types.ObjectId.isValid(val)),
    NewPersonaSchema,
  ]),
  object: z.string().trim().nonempty(),
  environment: z.string().trim().nonempty(),
  message: z.string().trim().nonempty(),
  service: z.string().trim().nonempty(),
});

export type NewPoemsTemplate = z.infer<typeof NewPoemsTemplateSchema>;

export interface PoemsTemplate extends Base, NewPoemsTemplate {
  persona: Persona;
  issue: Issue | string;
}
