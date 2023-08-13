import UserModel from '@/server/models/user';
import { generateToken } from '@/server/utils/token';
import { Role } from '@/types/user';

export default defineEventHandler(async (event) => {
  const { uid, name } = (await readBody(event)) as {
    uid: string;
    name: string;
  };

  let userData = await UserModel.findOne({ uid });
  let role: Role;

  if (userData) {
    role = userData.role;
    if (userData.name !== name) {
      // TODO: handle name changes
      userData.name = name;
      await userData.save();
    }
  } else {
    role = 'user';
    userData = await createUser({ uid, name, role, issues: [] });
  }

  const accessToken = await generateToken(
    { id: userData.id, name, role },
    '10s'
  );

  const refreshToken = await generateToken({ id: userData.id });

  // setCookie(event, 'access_token', accessToken);
  setCookie(event, 'refresh_token', refreshToken);

  return { message: 'user created', user: userData, accessToken };
});
