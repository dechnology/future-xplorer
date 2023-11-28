import { z } from 'zod';
import {
  Base,
  Workshop,
  User,
  Persona,
  Case,
  PoemsTemplate,
  Story,
  Illustration,
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
  poemsTemplates: PoemsTemplate[];
  stories: Story[];
  illustrations: Illustration[];
}

export interface Issue extends BaseIssue, IssueResources {
  workshop?: Workshop;
  users?: User[];
}

export type IssueTabKeys =
  | 'persona'
  | 'case'
  | 'keywordSort'
  | 'keywordVote'
  | 'poemsTemplate'
  | 'story'
  | 'illustration';

export interface IssueTab {
  name: IssueTabKeys;
  title: string;
}

export const IssueTabs: Record<IssueTabKeys, IssueTab> = {
  persona: { name: 'persona', title: '人物清單' },
  case: { name: 'case', title: '案例清單' },
  keywordSort: { name: 'keywordSort', title: '關鍵字整理' },
  keywordVote: { name: 'keywordVote', title: '關鍵字分享' },
  poemsTemplate: { name: 'poemsTemplate', title: '模板設計' },
  story: { name: 'story', title: '情境故事' },
  illustration: { name: 'illustration', title: '圖片產製' },
} as const;

export interface IssueContext {
  workshop: Pick<Workshop, '_id' | 'name' | 'description'>;
  issue: Pick<Issue, '_id' | 'title' | 'description'>;
}
