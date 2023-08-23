import { Base, Case } from '@/types';
import { z } from 'zod';

export interface Vote {
  user: string;
  keyword: string;
}

export const NewKeywordSchema = z.object({
  body: z.string().trim().nonempty(),
});

export type NewKeyword = z.infer<typeof NewKeywordSchema>;

export interface Keyword extends Base, NewKeyword {
  case: string | Case;
  category?: string;
}
