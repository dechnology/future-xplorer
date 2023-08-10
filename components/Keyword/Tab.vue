<template>
  <div
    class="flex h-16 items-center rounded-lg border border-solid border-gray-300 bg-slate-100"
  >
    <div
      @click="$emit('update:modelValue', el.name)"
      v-for="el in elements"
      :key="el.name"
      class="h-full cursor-pointer rounded-lg border border-solid border-gray-300 px-6 py-3"
      :class="modelValue === el.name && 'bg-blue-400'"
    >
      <span class="text-xl font-medium">{{ el.name }}</span>
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

const tabs = elements.value.map((el) => el.name);
</script>
