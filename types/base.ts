import { User } from '@/types/user';

export interface Base {
  readonly _id: string;
  readonly createdAt: Date;

  updatedAt: Date;
  creator: User; // This field is always populated
}
