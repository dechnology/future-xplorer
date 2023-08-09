import { Base } from '@/types/base';
import { Charactor } from 'types/character';

export interface Template extends Base {
  title: string;
  content: string;

  charaterId: string;
  character?: Charactor;

  object: string;
  environment: string;
  message: string;
  service: string;
}
