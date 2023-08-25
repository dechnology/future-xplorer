<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="title"
      class="bg-transparent px-1 text-lg font-semibold text-gray-700"
    >
      {{ title }}
    </label>
    <div class="relative">
      <input
        type="text"
        class="h-16"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="classes"
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
          @click="() => (dropdownShown = !dropdownShown)"
          class="cursor-pointer"
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
        @item-click="
          (item) => {
            dropdownShown = false;
            $emit('update:modelValue', item);
          }
        "
        @close-menu="() => (dropdownShown = false)"
        :items="selectOptions"
        :shown="dropdownShown"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClassNameValue, twMerge } from 'tailwind-merge';

interface Props {
  title?: string;
  placeholder: string;
  disabled?: boolean;
  modelValue: string | number;
  selectOnly?: boolean;
  readOnly?: boolean;
  readonly selectOptions?: string[];
}

const props = withDefaults(defineProps<Props>(), {
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
