export interface CardState {
  name: string;
  formTitle: string;
}

export const CardStates = {
  New: {
    name: 'new',
    formTitle: '新增',
  } as CardState,
  Detail: {
    name: 'detail',
    formTitle: '資訊',
  } as CardState,
  Editing: {
    name: 'editing',
    formTitle: '編輯',
  } as CardState,
} as const;
