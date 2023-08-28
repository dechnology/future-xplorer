<template>
  <div class="flex min-h-0 shrink grow basis-auto flex-col bg-gray-50">
    <div
      class="flex min-h-0 max-w-[1920px] shrink grow basis-auto items-stretch justify-center gap-8 p-10"
    >
      <div class="flex flex-col gap-5" :style="{ flexBasis: leftBasis }">
        <Breadcrumbs />
        <slot name="form" class="grow" />
      </div>
      <div class="overflow-hidden" :style="{ flexBasis: rightBasis }">
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
