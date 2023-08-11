import User from '@/server/models/user';

export default defineEventHandler(async (event) => {
  const { uid, name } = (await readBody(event)) as {
    uid: string;
    name: string;
  };

  let userData = await User.findOne({ uid });

  if (userData) {
    if (userData.name !== name) {
    }
  } else {
    userData = await createUser({ uid, name, isAdmin: false, issues: [] });
  }

  // const userData = await createUser({ ...body, isAdmin: false });
  return { message: 'user created', user: userData };
});
