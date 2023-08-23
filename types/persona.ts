import { z } from 'zod';
import { Base, Issue, Workshop } from '@/types';

export const personaPresets = {
  role: ['教師', '學生', '媽媽', '爸爸'],
  gender: ['male', 'female'],
  age: ['青少年', 'Z世代 (Gen Z)', '老人'],
  trait: [
    '行為數位化',
    '資訊素養高',
    '環境意識高',
    '習慣科技運用',
    '需關注心理健康',
  ],
} as const;

export const NewPersonaSchema = z.object({
  role: z.string().trim().nonempty(),
  name: z.string().trim().nonempty(),
  age: z.union([
    z.string().trim().nonempty(),
    z.number().int().positive().finite().safe(),
  ]),
  gender: z.enum(personaPresets.gender),
  trait: z.string().trim().nonempty(),
  other: z.string().trim(),
  image: z.string().url().nullable(),
});

export type NewPersona = z.infer<typeof NewPersonaSchema>;

export interface Persona extends Base, NewPersona {
  issue: Issue | string;
}

export interface PersonaContext {
  workshop: Pick<Workshop, '_id' | 'name' | 'description'>;
  issue: Pick<Issue, '_id' | 'title' | 'description'>;
}

export interface PortraitRequestBody extends PersonaContext {
  persona: NewPersona;
}
