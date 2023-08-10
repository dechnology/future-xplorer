<template>
  <!-- The only page where <NavBar /> is not needed is the login page -->
  <NavBar v-if="!$route.path.startsWith('/login')" />
  <div class="flex items-stretch justify-center gap-8 bg-[#F7F8F9] px-14 pt-16">
    <div class="basis-1/3">
      <Breadcrumb class="mb-5" />
      <slot name="detail-pane" />
    </div>
    <div class="basis-2/3">
      <slot />
    </div>
  </div>
</template>
