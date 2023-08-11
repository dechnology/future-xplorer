import { Base } from '@/types/base';
import { BaseIssue } from '@/types/issue';
import { Schema } from 'mongoose';

export interface NewUser {
  uid: string;
  name: string;
  isAdmin: boolean;
  issues: (Schema.Types.ObjectId | BaseIssue)[];
}

export type User = Omit<Base, 'creatorId' | 'creator'> & NewUser;
