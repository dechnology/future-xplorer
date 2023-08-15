import { Base } from '@/types/base';
import { Issue } from '@/types/issue';

export const personaPresets = {
  role: ['教師', '學生', '媽媽', '爸爸'],
  gender: ['男', '女'],
  age: ['青少年', 'Z世代 (Gen Z)', '嬰兒'],
  trait: [
    '行為數位化',
    '資訊素養高',
    '環境意識高',
    '習慣科技運用',
    '需關注心理健康',
  ],
} as const;

export interface NewPersona {
  role: string;
  name: string;
  age: string | number;
  gender: 'male' | 'female';
  trait: string;
  other: string;

  image?: string;
}

export interface Persona extends Base, NewPersona {
  issue: Issue | string;
}
