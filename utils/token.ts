import { FetchError } from 'ofetch';

export const refreshAccessToken = async () => {
  const { data: accessToken, error } = await useFetch('/api/refresh');

  if (error.value) {
    throw error.value;
  }

  if (!accessToken.value) {
    throw new FetchError('no token were responded');
  }

  return accessToken.value;
};
