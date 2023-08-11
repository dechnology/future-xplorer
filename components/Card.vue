<template>
  <div v-if="icon" :class="cardClasses" class="items-center justify-center">
    <Icon v-bind="icon" />
  </div>
  <div v-else :class="cardClasses">
    <!-- Image -->
    <div v-if="imageUrl" class="h-44 w-full">
      <img class="h-full w-full object-cover" :src="imageUrl" alt="" />
    </div>
    <div class="flex h-full flex-col px-5 py-6">
      <!--  Title -->
      <h3 v-if="title" class="text-2xl font-bold">{{ title }}</h3>
      <!-- Description (use this as the main content of the card) -->
      <p v-if="description" class="flex-grow overflow-hidden">
        {{ description }}
      </p>
      <!-- Lines -->
      <div v-if="lines" class="flex flex-col text-sm">
        <div v-for="line in lines" class="truncate">{{ line }}</div>
      </div>
      <!-- Footnotes -->
      <div
        v-if="footnotes"
        class="mt-auto flex flex-col items-end justify-self-end text-[10px] text-gray-300"
      >
        <div v-for="note in footnotes" class="truncate">{{ note }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

interface Props {
  title?: string;
  description?: string;
  lines?: string[];
  footnotes?: string[];
  imageUrl?: string;
  classes?: string;
  isActivated: boolean;

  icon?: { name: string; size: string };
}
const props = defineProps<Props>();

const defaultClasses =
  'flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-solid border-gray-400 transition-all hover:shadow-2xl';

const cardClasses = computed(() =>
  twMerge(
    defaultClasses,
    props.isActivated ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
    props.classes
  )
);
</script>
