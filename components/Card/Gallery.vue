<template>
  <div
    class="grid gap-2 overflow-y-auto rounded-xl p-2 xl:gap-4"
    :style="{
      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ gridCols?: number }>(), { gridCols: 3 });
</script>
