import { UncaughtError } from '@/types/errors';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { decodeJwt } from 'jose';

const needRefresh = (accessToken: string | null): boolean => {
  if (!accessToken) {
    console.log('no access token, need refreshing');
    return true;
  }
  const claims = decodeJwt(accessToken);

  if (!claims.exp) {
    console.error('no exp claim');
    return true;
  }

  const now = Math.floor(Date.now() / 1000);
  if (now >= claims.exp) {
    console.log('access token expired, requesting a new one');
    return true;
  }

  return false;
};

export const useAuth = async () => {
  const store = useAuthStore();
  const { user, accessToken } = storeToRefs(store);
  const error = ref<Error | null>(null);

  const getTokenSilently = async () => {
    return needRefresh(accessToken.value)
      ? await refreshAccessToken()
      : accessToken.value;
  };

  try {
    accessToken.value = await getTokenSilently();
    if (!user.value) {
      user.value = await fetchUser();
    }
  } catch (e) {
    if (e instanceof Error) {
      error.value = e;
    } else {
      error.value = new UncaughtError();
    }
  }

  return { user, error, getTokenSilently };
};