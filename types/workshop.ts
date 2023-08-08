import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Issue } from '@/types/issue';

export interface WorkshopElement extends Base {
  name: string;
  category: 'object' | 'environment' | 'message' | 'service';
  workshipId: string;
}

export interface Workshop extends Base {
  name: string;
  description: string;
  startAt?: Date;
  endAt?: Date;

  object?: WorkshopElement[];
  environment?: WorkshopElement[];
  message?: WorkshopElement[];
  service?: WorkshopElement[];
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
