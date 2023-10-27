<template>
  <div
    class="min-h-0 min-w-[1080px] shrink grow basis-auto items-center bg-gray-50"
  >
    <div class="flex h-full items-stretch justify-center gap-8 p-10">
      <div class="flex basis-1/2 flex-col gap-5">
        <Breadcrumbs />
        <slot name="form" />
      </div>
      <div class="basis-1/2">
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
