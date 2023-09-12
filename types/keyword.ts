import { Base, Case, User } from '@/types';
import { z } from 'zod';

export const NewKeywordSchema = z.object({
  body: z.string().trim().nonempty(),
});

export type NewKeyword = z.infer<typeof NewKeywordSchema>;

export interface Keyword extends Base, NewKeyword {
  case: Case | string;
  category?: string;
  type?: 'O' | 'E' | 'M' | 'S';
  votes: Vote[];
}

export interface NewVote {
  keyword: Keyword;
}

export type Vote = Base & NewVote;
