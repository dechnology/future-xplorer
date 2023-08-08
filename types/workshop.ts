import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Issue } from '@/types/issue';

export interface NewWorkshopElement {
  name: string;
  category: 'object' | 'environment' | 'message' | 'service';
}

export interface WorkshopElement extends NewWorkshopElement, Base {
  workshopId: string;
}

export interface NewWorkshop {
  name: string;
  description: string;
  startAt: Date;
  endAt: Date;

  elements: NewWorkshopElement[];
}

export interface Workshop extends Omit<NewWorkshop, 'elements'>, Base {
  elements: WorkshopElement[];
  issues?: Issue[];
  users?: User[];
}

export interface WorkshopState {
  name: string;
  formTitle: string;
}

export const WorkshopStates = {
  New: {
    name: 'new',
    formTitle: '新增工作坊',
  } as WorkshopState,
  Detail: {
    name: 'detail',
    formTitle: '工作坊資訊',
  } as WorkshopState,
  Editing: {
    name: 'editing',
    formTitle: '編輯工作坊',
  } as WorkshopState,
} as const;
