<template>
  <!-- The only page where <NavBar /> is not needed is the login page -->
  <div class="flex h-screen flex-col overflow-hidden">
    <NavBar v-if="!$route.path.startsWith('/login')" />
    <NuxtPage />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
