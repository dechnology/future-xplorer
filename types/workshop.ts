import { Base } from '@/types/base';
import { User } from '@/types/user';
import { BaseIssue } from '@/types/issue';

export const ElementCategories = {
  object: 1,
  environment: 2,
  message: 3,
  service: 4,
} as const;

type ElementCategory = keyof typeof ElementCategories;

export interface WorkshopElement {
  readonly name: string;
  readonly category: ElementCategory;
}

export interface NewWorkshop {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;

  elements: WorkshopElement[];
}

export type BaseWorkshop = Base & NewWorkshop;

export interface Workshop extends BaseWorkshop {
  users: User[];
  issues: BaseIssue[];
}
