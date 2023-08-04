export interface Issue {
  title: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IssueState {
  name: string;
  formTitle: string;
}

export const IssueStates = {
  New: {
    name: 'new',
    formTitle: '新增議題',
  } as IssueState,
  Detail: {
    name: 'detail',
    formTitle: '議題資訊',
  } as IssueState,
  Editing: {
    name: 'editing',
    formTitle: '編輯議題',
  } as IssueState,
} as const;
