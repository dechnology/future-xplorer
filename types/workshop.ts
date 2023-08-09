import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Issue } from '@/types/issue';

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

export interface Workshop extends NewWorkshop, Base {
  issues?: Issue[];
  users?: User[];
}
