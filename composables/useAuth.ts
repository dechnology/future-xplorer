import { decodeJwt } from 'jose';
import { UncaughtError } from '@/types';
import { useAuthStore } from '@/stores/auth';

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

export const useAuth = () => {
  const store = useAuthStore();
  const { user, accessToken } = storeToRefs(store);
  const error = ref<Error | null>(null);

  const userId = computed(() => {
    if (user.value) {
      return user.value._id;
    }
  });

  const username = computed(() => {
    if (user.value) {
      return user.value.name;
    }
  });

  const getTokenSilently = async (): Promise<string> => {
    if (needRefresh(accessToken.value)) {
      accessToken.value = await refreshAccessToken();
    }

    if (!accessToken.value) {
      throw Error('Unable to get token');
    }

    return accessToken.value;
  };

  const authenticate = async () => {
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
  };

  const logout = async () => {
    store.clearAccessToken();
    const { error } = await useFetch('/api/logout', { method: 'DELETE' });

    if (error.value) {
      console.error(error.value);
    }
  };

  return {
    user,
    userId,
    username,
    error,
    getTokenSilently,
    authenticate,
    logout,
  };
};
