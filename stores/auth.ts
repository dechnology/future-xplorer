import { User } from '@/types/user';

export const useAuthStore = definePiniaStore('auth', () => {
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);

  function clearUser() {
    user.value = null;
  }

  function clearAccessToken() {
    accessToken.value = null;
  }

  function setUser(u: User) {
    user.value = u;
  }

  function setAccessToken(t: string) {
    accessToken.value = t;
  }

  return {
    user,
    accessToken,
    clearUser,
    clearAccessToken,
    setUser,
    setAccessToken,
  };
});
