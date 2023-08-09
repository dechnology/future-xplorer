import { Base } from '@/types/base';

export interface NewCase {
  title: string;
  background: string;
  method: string;
  goal: string;
  challenge: string;
  result: string;
  reference: string;
  imageUrl?: string;
  other: string;
}

export type Case = NewCase & Base;
