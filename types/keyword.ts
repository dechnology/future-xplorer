import { z } from 'zod';
import { Base, Case } from '@/types';

export const NewKeywordSchema = z.object({
  body: z.string().trim().nonempty(),
});

export type NewKeyword = z.infer<typeof NewKeywordSchema>;

interface KeywordBase extends Base, NewKeyword {
  case: Case | string;
  category?: string;
  type?: 'O' | 'E' | 'M' | 'S';
}

export interface NewVote {
  keyword: KeywordBase;
}

export type Vote = Base & NewVote;

export interface Keyword extends Base, NewKeyword {
  case: Case | string;
  category?: string;
  type?: 'O' | 'E' | 'M' | 'S';
  votes: Vote[];
}
