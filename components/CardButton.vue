<template>
  <div
    class="m-auto flex h-12 w-44 items-center gap-4 rounded-lg bg-blue-700 px-4 text-white"
  >
    <Icon name="mdi:forum-plus" size="3rem" />
    <div class="w-full text-center">{{ body }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string;
  body: string;
}
const props = defineProps<Props>();
</script>
