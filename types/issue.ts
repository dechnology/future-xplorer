import { Base } from '@/types/base';
import { User } from '@/types/user';
import { Character } from '@/types/character';
import { Case } from '@/types/case';
import { Keyword } from '@/types/keyword';

export interface NewIssue {
  title: string;
  description: string;
}

export interface BaseIssue extends Base, NewIssue {
  readonly workshopId: string;
}

export interface Issue extends BaseIssue {
  users: User[];
  charaters: Character[];
  cases: Case[];
  keywords: Keyword[];
}
