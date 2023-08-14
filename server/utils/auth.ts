import { H3EventContext } from 'h3';
import { errors } from 'jose';
import { NoTokenError } from '@/types/errors';

export const authenticate = (ctx: H3EventContext) => {
  const { error, payload } = ctx;

  if (error) {
    if (!(error instanceof NoTokenError || error instanceof errors.JOSEError)) {
      throw error;
    }

    let code = error instanceof errors.JWTClaimValidationFailed ? 400 : 401;
    throw createError({
      statusCode: code,
      statusMessage: error.code,
    });
  }

  if (!payload) {
    throw new Error('No payload found');
  }

  const { id, role, name } = payload;

  return { id, role, name };
};

export const authorize = (
  ctx: H3EventContext,
  requiredRole: string
): boolean => {
  const { payload } = ctx;

  if (payload?.role === requiredRole) {
    return true;
  }

  throw new Error(
    `User (${payload?.role}) does not have the required role (${requiredRole})`
  );
};
