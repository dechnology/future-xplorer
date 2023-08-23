import { errors } from 'jose';
import { NoTokenError, UncaughtError } from '@/types/errors';

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api')) {
    return;
  }

  console.log(event.path);

  try {
    const authHeader = getHeader(event, 'Authorization');
    const accessToken = authHeader?.split(' ')[1] || null;
    if (!accessToken) {
      throw new NoTokenError();
    }
    console.log('user accessToken:', accessToken);
    const payload = await VerifyToken(accessToken);
    console.table(payload);
    event.context.payload = payload;
    event.context.error = null;
  } catch (err) {
    event.context.payload = null;
    if (err instanceof Error) {
      if (!(err instanceof NoTokenError || err instanceof errors.JOSEError)) {
        console.error('Uncaught error:', err);
        event.context.error = new UncaughtError(`${err.name}: ${err.message}`);
      } else {
        console.error('Token error:', err.message);
        event.context.error = err;
      }
    }
  }
});
