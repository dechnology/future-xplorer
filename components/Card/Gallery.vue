<template>
  <div
    class="grid gap-4 overflow-y-auto rounded-2xl p-2"
    :style="{
      gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
      // gridTemplateRows: 'repeat(auto-fill, 350px)',
    }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ gridCols?: number }>(), { gridCols: 4 });
</script>
