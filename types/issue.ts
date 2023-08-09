import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Workshop } from '@/types/workshop';
import { Character } from 'types/character';
import { Case } from '@/types/case';

export interface NewIssue {
  title: string;
  description: string;

  workshop?: Workshop;

  users?: User[];
  charaters?: Character[];
  cases?: Case[];
}

export type Issue = NewIssue &
  Base & {
    readonly workshopId: string;
  };
