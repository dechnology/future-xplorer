import { Base } from '@/types/base';

export const Roles = {
  admin: 1,
  user: 2,
} as const;

export type Role = keyof typeof Roles;

export interface NewUser {
  uid: string;
  name: string;
  role: Role;
  issues: string[];
}

export type User = Omit<Base, 'creator'> & NewUser;

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
}
