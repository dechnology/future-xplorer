export default defineNuxtRouteMiddleware(async (to, from) => {
  // skip middleware on server
  if (process.server) {
    console.log('skip server auth');
    return;
  }

  const refreshToken = useCookie('refresh_token');

  if (!refreshToken.value) {
    console.log('No refresh token');
    if (to.fullPath === '/login') {
      return;
    }
    console.log('back to login page');
    return navigateTo('/login');
  }

  const { user, error } = await useAuth();

  console.log('current user: ', user.value);

  if (error.value) {
    console.error(error.value);

    if (to.fullPath !== '/login') {
      console.log('back to login page');
      return navigateTo('/login');
    }
  }
});
