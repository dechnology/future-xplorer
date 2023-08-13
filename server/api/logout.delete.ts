export default defineEventHandler((event) => {
  console.log('user logout');
  deleteCookie(event, 'refresh_token');
});
