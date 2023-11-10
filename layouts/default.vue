<template>
  <div
    class="flex min-h-0 w-full shrink grow basis-auto items-stretch justify-center gap-2 bg-gray-50 p-4 lg:p-6 xl:gap-8 xl:p-10"
  >
    <div
      class="flex min-w-0 shrink-0 grow-0 basis-1/2 flex-col gap-1 lg:gap-3 xl:gap-5"
    >
      <Breadcrumbs />
      <slot name="form" />
    </div>
    <div class="min-w-0 shrink-0 grow-0 basis-1/2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    leftBasis?: string;
    rightBasis?: string;
  }>(),
  { leftBasis: `${100 / 3}%`, rightBasis: `${200 / 3}%` }
);
</script>
