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

// Make sure CurrentIssueResources and ActiveIssueResources are synced
export interface CurrentIssueResources {
  persona: Persona | NewPersona;
  case: Case | NewCase;
}

export interface ActiveIssueResources {
  persona: Persona | null;
  case: Case | null;
}

export type IssueResourceKeys = keyof CurrentIssueResources;
export type IssueTabKeys = IssueResourceKeys;

export interface IssueTab {
  name: IssueTabKeys;
  resourceName: string;
  title: string;
}

export const IssueTabs: Record<IssueTabKeys, IssueTab> = {
  persona: {
    name: 'persona',
    resourceName: '人物',
    title: '人物清單',
  },
  case: { name: 'case', resourceName: '案例', title: '案例清單' },
} as const;
