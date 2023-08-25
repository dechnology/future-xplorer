<template>
  <div
    class="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg bg-white px-4 py-5 shadow-2xl"
  >
    <Icon v-bind="icon" class="text-zinc-400" />
    <div v-if="text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: { name: string; size: string };
  text?: string;
}
const props = defineProps<Props>();
</script>
