import User from '@/server/models/user';
import { NewUser } from '@/types/user';

export const createUser = async (user: NewUser) => {
  const userData = await User.create(user);
  return userData;
};
