<template>
  <NavBar v-if="!$route.path.startsWith('/login')" />
  <div class="flex items-start justify-center gap-8 bg-[#F7F8F9] px-14 pt-16">
    <div class="basis-1/2">
      <Breadcrumb class="mb-5" />
      <slot name="detail-pane" />
    </div>
    <div class="basis-1/2">
      <slot />
    </div>
  </div>
</template>
