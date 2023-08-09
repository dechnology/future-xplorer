import { Base } from '@/types/base';

export interface NewCharacter {
  role: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'nonbinary';
  trait: string;
  other: string;

  imageUrl: string;
}

export interface Character extends Base, NewCharacter {
  issueId: string;
}
