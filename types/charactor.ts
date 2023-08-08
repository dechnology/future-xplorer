import { Base } from '@/types/base';

export interface Charactor extends Base {
  role: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'nonbinary';
  trait: string;
  other: string;

  issueId: string;
}
