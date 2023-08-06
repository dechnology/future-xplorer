<template>
  <div
    v-if="icon"
    class="flex h-full w-full flex-col items-center justify-center gap-4"
  >
    <Icon v-bind="icon" />
  </div>
  <div v-else class="flex h-full w-full flex-col justify-between gap-4">
    <!--  Title -->
    <h3 v-if="title" class="text-2xl font-bold">{{ title }}</h3>
    <!-- Description (use this as the main content of the card) -->
    <p v-if="description" class="flex-grow overflow-hidden">
      {{ description }}
    </p>
    <!-- Lines -->
    <div v-if="lines" class="flex flex-col">
      <div v-for="line in lines">{{ line }}</div>
    </div>
    <!-- Footnotes -->
    <div
      v-if="footnotes"
      class="mt-auto flex flex-col items-end text-[10px] text-gray-300"
    >
      <div v-for="note in footnotes">{{ note }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  lines?: string[];
  footnotes?: string[];
  image?: string;

  icon?: { name: string; size: string };
}
const props = defineProps<Props>();
</script>
