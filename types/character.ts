import { Base } from '@/types/base';

export interface NewCharacter {
  role: string;
  name: string;
  age: string | number;
  gender: 'male' | 'female';
  trait: string;
  other: string;

  imageUrl?: string;
}

export interface Character extends Base, NewCharacter {
  issueId: string;
}
