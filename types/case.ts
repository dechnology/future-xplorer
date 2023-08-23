import { z } from 'zod';
import { Base, Issue, Keyword } from '@/types';

export const NewCaseSchema = z.object({
  title: z.string().trim().nonempty(),
  background: z.string().trim().nonempty(),
  method: z.string().trim().nonempty(),
  goal: z.string().trim().nonempty(),
  challenge: z.string().trim().nonempty(),
  result: z.string().trim().nonempty(),
  reference: z.string().trim().nonempty(),
  other: z.string().trim(),
  image: z.string().trim().nullable(),
});

export type NewCase = z.infer<typeof NewCaseSchema>;

export interface Case extends Base, NewCase {
  issue: Issue | string;
  keywords: Keyword[];
}
