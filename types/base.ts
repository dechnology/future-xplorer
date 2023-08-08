import { User } from '@/types/user';

export interface Base {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator?: User;
}
