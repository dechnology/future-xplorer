<template>
  <!-- The only page where <NavBar /> is not needed is the login page -->
  <NavBar v-if="!$route.path.startsWith('/login')" />
  <div
    class="flex items-stretch justify-center gap-8 overflow-hidden bg-[#F7F8F9] px-14 pb-8 pt-16"
  >
    <div class="flex h-full basis-2/3 flex-col gap-5 overflow-hidden">
      <Breadcrumb />
      <slot name="detail-pane" class="grow" />
    </div>
    <div class="basis-1/3 overflow-hidden">
      <slot />
    </div>
  </div>
</template>
