<template>
  <!-- The only page where <NavBar /> is not needed is the login page -->
  <NavBar v-if="!$route.path.startsWith('/login')" />
  <NuxtPage />
</template>
