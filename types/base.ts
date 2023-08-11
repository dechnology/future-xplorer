import { User } from '@/types/user';

export interface Base {
  readonly id: string;
  readonly creatorId: string;
  readonly createdAt: Date;

  updatedAt: Date;
  creator: User | string;
}
