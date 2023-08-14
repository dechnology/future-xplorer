import { storeToRefs } from 'pinia';

export const fetchUser = async () => {
  const store = useAuthStore();
  const { accessToken } = storeToRefs(store);

  if (!accessToken.value) {
    throw new Error('No access token');
  }

  const { data, error } = await useFetch('/api/user', {
    headers: { Authorization: `Bearer ${accessToken.value}` },
  });

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('user is null');
  }

  return deserializeUser(data.value);
};
