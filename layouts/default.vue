<template>
  <div class="min-h-0 shrink grow basis-auto items-center bg-gray-50">
    <div
      class="flex h-full items-stretch justify-center gap-2 p-4 lg:p-6 xl:gap-8 xl:p-10"
    >
      <div class="flex shrink-0 basis-1/2 flex-col gap-1 lg:gap-3 xl:gap-5">
        <Breadcrumbs />
        <slot name="form" />
      </div>
      <div class="shrink-0 basis-1/2">
        <slot />
      </div>
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
