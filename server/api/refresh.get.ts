import { UserModel } from '@/server/models';
import { generateToken } from '@/server/utils/token';

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, 'refresh_token');

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No refresh token provided',
    });
  }

  console.log('user refresh token:', refreshToken);
  const payload = await VerifyToken(refreshToken);
  const userData = await UserModel.findById(
    payload.id,
    'name role issues'
  ).exec();

  if (!userData) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User does not exist',
    });
  }

  const { name, id, role } = userData;

  const accessToken = await generateToken({ name, id, role }, '10min');

  return accessToken;
});
