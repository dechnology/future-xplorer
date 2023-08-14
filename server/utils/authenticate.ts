import { H3EventContext } from 'h3';
import { errors } from 'jose';
import { NoTokenError } from '@/types/errors';

export const authenticate = (ctx: H3EventContext) => {
  const { error, payload } = ctx;

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

  const { id, role, name } = payload;

  return { id, role, name };
};
