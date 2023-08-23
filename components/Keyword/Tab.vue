<template>
  <div class="flex h-24 shrink-0 items-start justify-between rounded-lg">
    <div class="flex h-full flex-1 overflow-x-scroll">
      <div v-for="(element, key) in elements">
        <div
          v-for="el in element"
          @click="$emit('update:modelValue', el)"
          :key="`${element}_${el}`"
          class="h-full cursor-pointer whitespace-nowrap rounded-lg border border-solid border-gray-300 px-6 py-3 text-xl font-medium"
          :class="modelValue === el && 'bg-blue-400 text-white'"
        >
          <span> {{ el }}</span>
          <span> / </span>
          <span>{{ key.charAt(0).toUpperCase() }}</span>
        </div>
      </div>
    </div>
    <div
      class="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-lg border border-solid border-gray-300"
    >
      <Icon name="mdi:plus" size="2rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

interface Props {
  modelValue: string;
}
const props = defineProps<Props>();

const issueStore = useIssueStore();
const { elements } = storeToRefs(issueStore);
</script>
