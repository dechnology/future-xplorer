<template>
  <div
    class="grid gap-4 overflow-y-auto rounded-2xl p-2"
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
