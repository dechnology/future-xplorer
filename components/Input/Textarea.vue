<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="title"
      class="bg-white px-1 text-lg font-semibold text-gray-700"
    >
      {{ title }}
    </label>
    <textarea
      class="h-80 resize-none text-start"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    ></textarea>
  </div>
</template>

<script setup lang="ts">
import { ClassNameValue, twMerge } from 'tailwind-merge';

interface Props {
  title?: string;
  placeholder: string;
  disabled: boolean;
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

const defaultClasses: ClassNameValue = [
  'w-full',
  'rounded',
  'px-3',
  'py-4',
  'border',
  'border-solid',
  'border-gray-200',
];

const classes = computed(() => {
  if (props.disabled) {
    return twMerge(defaultClasses, 'bg-slate-50');
  }
  return twMerge(defaultClasses, ['border-gray-500', 'bg-white']);
});
</script>

<style scoped></style>
