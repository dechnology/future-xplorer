import { errors } from 'jose';
import { NoTokenError } from '@/types/errors';
import { User } from '@/types/user';
import { UserModel } from '@/server/models';

export default defineEventHandler(async (event): Promise<User[]> => {
  const { error, payload } = event.context;

  if (error) {
    if (!(error instanceof NoTokenError || error instanceof errors.JOSEError)) {
      throw createError({
        statusCode: 501,
        statusMessage: error.message,
      });
    }

    let code = error instanceof errors.JWTClaimValidationFailed ? 400 : 401;
    throw createError({
      statusCode: code,
      statusMessage: error.code,
    });
  }

  if (!payload) {
    throw createError({
      statusCode: 501,
      statusMessage: 'No payload found',
    });
  }

  const users = await UserModel.find({}, '-uid');

  if (!users) {
    throw createError({
      statusCode: 501,
      statusMessage: 'User does not exist',
    });
  }

  return users;
});
