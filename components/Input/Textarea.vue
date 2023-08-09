<template>
  <div class="flex flex-col gap-2">
    <label v-if="title" :class="resultTitleClasses">
      {{ title }}
    </label>
    <textarea
      :placeholder="placeholder"
      :disabled="disabled"
      :class="resultInputClasses"
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

  titleClasses?: string;
  inputClasses?: string;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

const defaultTitleClasses: ClassNameValue = [
  'bg-white',
  'px-1',
  'text-lg',
  'font-semibold',
  'text-gray-700',
];

const defaultInputClasses: ClassNameValue = [
  'resize-none',
  'text-start',
  'w-full',
  'h-full',
  'rounded',
  'px-3',
  'py-4',
  'border',
  'border-solid',
  'border-gray-200',
];

const resultInputClasses = computed(() => {
  const result = twMerge(defaultInputClasses, props.inputClasses);
  if (props.disabled) {
    return twMerge(result, 'bg-slate-50');
  }
  return twMerge(result, ['border-gray-500', 'bg-white']);
});

const resultTitleClasses = computed(() => {
  const result = twMerge(defaultTitleClasses, props.titleClasses);
  if (props.disabled) {
    return twMerge(result, 'bg-slate-50');
  }
  return twMerge(result, ['border-gray-500', 'bg-white']);
});
</script>

<style scoped></style>
