import { z } from 'zod';
import { Base, Issue, IssueContext } from '@/types';

export const NewPersonaSchema = z.object({
  role: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  age: z.string().trim().nonempty(),
  gender: z.enum(['male', 'female']),
  trait: z.string().trim().nonempty(),
  other: z.string().trim(),
  image: z.string().url().nullable(),
});

export type NewPersona = z.infer<typeof NewPersonaSchema>;

export interface Persona extends Base, NewPersona {
  issue?: Issue | string;
}

export interface PortraitRequestBody extends IssueContext {
  persona: NewPersona;
}
