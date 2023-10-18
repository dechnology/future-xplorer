<template>
  <div class="min-h-0 shrink grow basis-auto items-center bg-gray-50">
    <div
      class="flex h-full min-w-[1080px] items-stretch justify-center gap-8 p-10"
    >
      <div class="flex flex-col gap-5" :style="{ flexBasis: leftBasis }">
        <Breadcrumbs />
        <slot name="form" />
      </div>
      <div :style="{ flexBasis: rightBasis }">
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
