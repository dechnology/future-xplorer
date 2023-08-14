export default defineEventHandler((event) => {
  console.log('user logout');
  deleteCookie(event, 'refresh_token');
  setResponseStatus(event, 204);
  return { message: 'logged out' };
});
