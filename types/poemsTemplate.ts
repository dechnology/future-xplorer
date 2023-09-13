import { z } from 'zod';
import { Base, Issue, Persona } from '@/types';

export const NewPoemsTemplateSchema = z.object({
  title: z.string().trim().nonempty(),
  object: z.string().trim().nonempty(),
  environment: z.string().trim().nonempty(),
  message: z.string().trim().nonempty(),
  service: z.string().trim().nonempty(),
});

export interface NewPoemsTemplate
  extends z.infer<typeof NewPoemsTemplateSchema> {
  persona?: Persona;
}

export interface PoemsTemplate extends Base, Omit<NewPoemsTemplate, 'persona'> {
  issue: Issue | string;
  persona: Persona;
}
