<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <div class="relative">
      <input
        type="text"
        class="h-16"
        :class="classes"
        :placeholder="placeholder"
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
      <div
        v-if="selectOptions"
        class="absolute inset-y-0 right-2 flex items-center justify-center"
      >
        <div
          class="cursor-pointer"
          @click="() => (dropdownShown = !dropdownShown)"
        >
          <Icon
            class="transition-all duration-300"
            :class="!dropdownShown && 'rotate-180'"
            name="mdi:chevron-down"
            size="3rem"
          />
        </div>
      </div>
      <Dropdown
        v-if="selectOptions"
        class="origin-top-right transition-all duration-300"
        :class="dropdownShown ? 'scale-100' : 'scale-0'"
        :items="selectOptions"
        :shown="dropdownShown"
        @item-click="
          (item) => {
            dropdownShown = false;
            $emit('update:modelValue', item);
          }
        "
        @close-menu="() => (dropdownShown = false)"
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

defineEmits<{
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
