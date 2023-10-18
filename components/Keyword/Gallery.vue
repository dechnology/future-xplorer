<template>
  <div
    class="grid min-h-0 shrink grow basis-auto grid-cols-2 content-start gap-2 overflow-y-auto p-2"
    :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
  >
    <slot>
      <!-- default content -->
    </slot>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gridCols?: number;
  searchQuery?: string;
  category?: string;
}
withDefaults(defineProps<Props>(), {
  gridCols: 1,
  searchQuery: undefined,
  category: undefined,
});
</script>
