<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <div class="relative">
      <input
        type="range"
        class="h-16"
        :class="classes"
        :disabled="disabled"
        :value="modelValue"
        :readonly="selectOnly || readOnly"
        @input="
          !selectOnly &&
            $emit(
              'update:modelValue',
              ($event.target as HTMLInputElement).value
            )
        "
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClassNameValue, twMerge } from 'tailwind-merge';

interface Props {
  modelValue: string | number;
  placeholder?: string;

  type?: 'text' | 'textarea';
  title?: string;
  disabled?: boolean;
  selectOnly?: boolean;
  readOnly?: boolean;
  selectOptions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  selectOnly: false,
  readOnly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
  (e: 'inputSelection', text: string): void;
}>();

const dropdownShown = ref(false);

const defaultClasses: ClassNameValue = [
  'w-full',
  'rounded',
  'pl-4',
  'pr-4',
  'py-4',
  'border',
  'border-solid',
  'border-gray-200',
];

const textareaClasses: ClassNameValue = ['resize-none', 'text-start'];

const classes = computed(() => {
  let resultClasses = twMerge(defaultClasses);
  if (props.disabled) {
    return twMerge(resultClasses, 'bg-slate-50');
  }

  if (props.selectOptions) {
    resultClasses = twMerge(resultClasses, 'pr-12');
  }

  return twMerge(resultClasses, ['border-gray-500', 'bg-transparent']);
});
</script>
