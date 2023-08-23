export const refreshAccessToken = async () => {
  console.log('refreshing token');

  const { data: accessToken, error } = await useFetch('/api/refresh');

  if (error.value) {
    throw error.value;
  }

  if (!accessToken.value) {
    throw new Error('no token were responded');
  }

  return accessToken.value;
};
