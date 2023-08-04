export interface Workshop {
  name: string;
  description: string;
  creator: string;
  id?: number;
  createdAt?: Date;
  updatedAt?: Date;

  startAt?: Date;
  endAt?: Date;

  objects: string[];
  environments: string[];
  messages: string[];
  services: string[];
}

// export interface WorkshopState {
//   name: string;
//   formTitle: string;
// }

// export const WorkshopStates = {
//   New: {
//     name: 'new',
//     formTitle: '新增議題',
//   } as WorkshopState,
//   Detail: {
//     name: 'detail',
//     formTitle: '議題資訊',
//   } as WorkshopState,
//   Editing: {
//     name: 'editing',
//     formTitle: '編輯議題',
//   } as WorkshopState,
// } as const;
