<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="title"
      class="bg-white px-1 text-lg font-semibold text-gray-700"
    >
      {{ title }}
    </label>
    <select
      class="h-16"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="classes"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    >
      <option v-for="opt in options" :value="opt">{{ opt }}</option>
    </select>
    <!-- <div
        v-if="options"
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
        v-if="options"
        class="origin-top-right transition-all duration-300"
        :class="dropdownShown ? 'scale-100' : 'scale-0'"
        @item-click="
          (item) => {
            dropdownShown = false;
            $emit('update:modelValue', item);
          }
        "
        :items="options"
      />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ClassNameValue, twMerge } from 'tailwind-merge';

interface Props {
  title?: string;
  placeholder: string;
  disabled: boolean;
  modelValue: string | number;
  options?: string[];
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const emit = defineEmits<{
  (e: 'update:modelValue'): void;
}>();

const dropdownShown = ref(false);

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
