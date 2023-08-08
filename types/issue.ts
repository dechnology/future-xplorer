import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Workshop } from '@/types/workshop';
import { Charactor } from '@/types/charactor';
import { Case } from '@/types/case';

export interface Issue extends Base {
  title: string;
  description: string;

  workshopId: string;
  workshop?: Workshop;

  users?: User[];
  charaters?: Charactor[];
  cases?: Case[];
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
