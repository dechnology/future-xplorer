<template>
  <div class="flex items-end gap-3">
    <h3 class="text-2xl font-medium leading-tight text-sky-950">
      {{ title }}
    </h3>
    <div
      v-if="creatorName"
      class="text-sm font-medium leading-snug text-black text-opacity-60"
    >
      建立者：{{ creatorName }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  creatorName?: string;
}
const props = defineProps<Props>();
</script>
