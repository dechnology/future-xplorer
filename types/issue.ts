import { z } from 'zod';
import { Base, Workshop, User, Persona, Case } from '@/types';

export const NewIssueSchema = z.object({
  title: z.string().trim().nonempty(),
  description: z.string().trim().nonempty(),
});

export type NewIssue = z.infer<typeof NewIssueSchema>;

export type BaseIssue = NewIssue & Base;

export interface IssueResources {
  personas: Persona[];
  cases: Case[];
}

export interface Issue extends BaseIssue, IssueResources {
  workshop?: Workshop;
  users?: User[];
}
