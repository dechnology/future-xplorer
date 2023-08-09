import { Base } from '@/types/base';
import { User } from '@/types/user';
import { BaseIssue } from '@/types/issue';

export interface WorkshopElement {
  name: string;
  category: 'object' | 'environment' | 'message' | 'service';
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
