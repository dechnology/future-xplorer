<template>
  <button :type="type">
    <div
      class="flex h-full w-full cursor-pointer items-center gap-2 transition-all hover:shadow-2xl"
    >
      <Icon v-if="icon" v-bind="icon" />
      <div class="w-full text-center">{{ body }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  icon?: {
    name: string;
    size: string;
  };
  body?: string;
  type?: 'button' | 'submit' | 'reset';
}
const { type = 'button' } = defineProps<Props>();
</script>
