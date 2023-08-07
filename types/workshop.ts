export interface WorkshopElementItem {
  name: string;
  color: string;
}

export interface WorkshopElement {
  name: string;
  description: string;
  items: WorkshopElementItem[];
}

export interface Workshop {
  name: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;

  startAt?: Date;
  endAt?: Date;

  elements: WorkshopElement[];
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
