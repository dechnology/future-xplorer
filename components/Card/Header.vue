<template>
  <div class="flex items-end gap-3">
    <h3 class="text-lg font-medium leading-tight text-sky-950 xl:text-2xl">
      {{ title }}
    </h3>
    <div
      v-if="creatorName"
      class="text-[9px] font-medium leading-snug text-black text-opacity-60 xl:text-sm"
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
defineProps<Props>();
</script>
