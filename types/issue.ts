import { z } from 'zod';
import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Persona } from './persona';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';
import { Workshop } from '@/types/workshop';

export const NewIssueSchema = z.object({
  title: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
});

export type NewIssue = z.infer<typeof NewIssueSchema>;

export interface BaseIssue extends z.infer<typeof NewIssueSchema>, Base {
  workshop: string | Workshop;
}

export interface Issue extends BaseIssue {
  users?: User[];
  personas: Persona[];
  // cases: Case[];
  // keywords: Keyword[];
}
