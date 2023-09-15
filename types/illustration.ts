import { z } from 'zod';
import { Base, Issue } from '@/types';

export const NewIllustrationSchema = z.object({
  story: z.string().trim().nonempty(),
  prompt: z.string().trim().nonempty(),
});

export type NewIllustration = z.infer<typeof NewIllustrationSchema>;

export interface Illustration extends Base, NewIllustration {
  image: string;
  issue: Issue | string;
}
