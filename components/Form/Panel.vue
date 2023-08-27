<template>
  <div class="flex min-h-0 shrink grow basis-auto flex-col gap-4">
    <div class="flex gap-2">
      <h2 class="pl-4 text-[32px] font-bold text-black">{{ panelTitle }}</h2>
      <Icon
        name="material-symbols:lightbulb-circle-outline-rounded"
        size="24px"
        class="text-blue-500"
      />
      <slot name="tooltip" />
    </div>
    <p class="pl-4 text-base font-normal leading-relaxed text-black">
      {{ panelDescription }}
    </p>
    <div class="min-h-0 shrink grow basis-auto overflow-y-auto p-2">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  panelTitle: string;
  panelDescription: string;
}>();
</script>
