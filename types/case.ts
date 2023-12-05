import { z } from 'zod';
import { Base, Issue, IssueContext, Keyword } from '@/types';

export const NewCaseContentSchema = z.object({
  background: z.string().trim().nonempty(),
  method: z.string().trim().nonempty(),
  goal: z.string().trim().nonempty(),
  challenge: z.string().trim().nonempty(),
  result: z.string().trim().nonempty(),
  reference: z.string().trim().nonempty(),
  other: z.string().trim(),
});

export type NewCaseContent = z.infer<typeof NewCaseContentSchema>;

export const NewCaseSchema = NewCaseContentSchema.extend({
  title: z.string().trim().nonempty(),
  image: z.string().trim().nullable(),
});

export type NewCase = z.infer<typeof NewCaseSchema>;

export interface Case extends Base, NewCase {
  issue: Issue | string;
  keywords: Keyword[];
}

export interface KeywordsRequestBody extends IssueContext {
  _case: NewCase;
}

export interface KeywordsResponseBody {
  keywords: { body: string; category: string; type: 'O' | 'E' | 'M' | 'S' }[];
}

export interface HistoryCase extends Omit<NewCase, 'image' | 'other'> {
  _id: string;
}
