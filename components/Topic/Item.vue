<template>
  <div class="flex">
    <div>{{ locked }}</div>
    <h2>{{ title }}</h2>
    <span>{{ creator }}</span>
    <span>{{ createdAt }}</span>
    <span>{{ updatedAt }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id?: string;
  title: string;
  creator: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  locked: boolean;
}
const props = defineProps<Props>();
</script>

<style scoped></style>
