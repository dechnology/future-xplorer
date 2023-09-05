<template>
  <div
    class="grid min-h-0 shrink grow basis-auto grid-cols-2 content-start gap-2 overflow-y-auto p-2"
    :style="{ gridTemplateColumns: `repeat(${n_cols}, minmax(0, 1fr))` }"
  >
    <slot>
      <!-- default content -->
    </slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ n_cols?: number }>(), { n_cols: 1 });
</script>
