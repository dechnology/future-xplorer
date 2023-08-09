import { Base } from '@/types/base';

export interface User extends Omit<Base, 'creatorId' | 'creator'> {
  uid: string; // uid is used for login and should be stored safely
  name: string;
  isAdmin: boolean;
  issueIds: string[];
}
