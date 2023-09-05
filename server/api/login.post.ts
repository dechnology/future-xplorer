import { UserModel } from '@/server/models';
import { generateToken } from '@/server/utils/token';
import { LoginResponse, Role } from '@/types';

export default defineEventHandler(async (event): Promise<LoginResponse> => {
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

  setCookie(event, 'refresh_token', refreshToken);

  return { message: 'user created', user: userData, accessToken };
});
