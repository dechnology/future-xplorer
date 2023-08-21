<template>
  <div
    class="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-solid border-gray-400 transition-all hover:shadow-2xl"
    :class="isActivated ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'"
  >
    <Icon v-bind="icon" />
    <div v-if="text">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isActivated: boolean;

  icon: { name: string; size: string };
  text?: string;
}
const props = defineProps<Props>();
</script>
