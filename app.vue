<template>
  <div class="flex h-screen flex-col overflow-x-auto overflow-y-hidden">
    <!-- The only page where <NavBar /> is not needed is the login page -->
    <NavBar v-if="!$route.path.startsWith('/login')" />
    <NuxtPage />
  </div>
</template>
