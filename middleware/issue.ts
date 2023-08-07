export default defineNuxtRouteMiddleware((to, from) => {
  // Check if the user is trying to access the index page
  if (to.fullPath.match(/\/issue\/[^\/]+$/)) {
    // If so, redirect to the "people" tab
    return navigateTo(`${to.fullPath}/people`);
  }
});
