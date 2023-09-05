import { z } from 'zod';
import {
  Base,
  Workshop,
  User,
  Persona,
  Case,
  NewPersona,
  NewCase,
} from '@/types';

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

export type IssueTabKeys = 'persona' | 'case' | 'keyword';

export interface IssueTab {
  name: IssueTabKeys;
  title: string;
}

export const IssueTabs: Record<IssueTabKeys, IssueTab> = {
  persona: { name: 'persona', title: '人物清單' },
  case: { name: 'case', title: '案例清單' },
  keyword: { name: 'keyword', title: '案例整理' },
} as const;
