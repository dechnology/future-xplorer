<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <div class="relative">
      <div v-bind="inputProps">
        <slot :selected="selected">
          <span v-if="placeholder" class="text-gray-500">
            {{ placeholder }}
          </span>
          <span v-else class="invisible">placeholder</span>
        </slot>
      </div>
      <div
        v-if="!disabled"
        class="absolute inset-y-0 right-2 flex items-center justify-center"
      >
        <Icon
          ref="dropdownIcon"
          class="cursor-pointer transition-all duration-300"
          :class="dropdownShown ? '-rotate-90' : 'rotate-90'"
          name="pepicons-pop:triangle-left-filled"
          size="1.25rem"
          @click="() => (dropdownShown = !dropdownShown)"
        />
      </div>
      <div
        v-if="!disabled"
        ref="dropdownDiv"
        class="absolute right-0 top-full z-10 mt-3 w-full origin-top-right transition-all duration-300"
        :class="dropdownShown ? 'scale-100' : 'scale-0'"
      >
        <Dropdown>
          <DropdownItem
            v-for="opt in options"
            :key="`${opt.name}_${opt.data}`"
            @click="() => handleClick(opt)"
          >
            {{ opt.name }}
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { SelectOption } from '~/types';

interface Props {
  // Required
  modelValue: T;
  options: SelectOption<T>[];

  // Optional
  title?: string;
  placeholder?: string;
  inputClasses?: string;

  // Optional with defaults
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
  (e: 'select', value: T): void;
}>();

const selected = shallowRef<SelectOption<T>>();
const dropdownShown = ref(false);
const dropdownIcon = ref<HTMLDivElement | null>(null);
const dropdownDiv = ref<HTMLDivElement | null>(null);

const inputProps = computed(() => {
  return {
    class: twMerge(
      [
        'w-full',
        'rounded',
        'pl-4',
        'pr-4',
        'py-4',
        'border',
        'border-solid',
        'border-black',
        'text-black',
      ],
      props.inputClasses,
      props.options && 'pr-12',
      props.disabled ? ['bg-slate-50'] : ['border-opacity-40']
    ),
    disabled: props.disabled,
    value: props.modelValue,
  };
});

const handleClick = (option: SelectOption<T>) => {
  selected.value = option;
  emit('update:modelValue', option.data);
  emit('select', option.data);
  dropdownShown.value = false;
};

onClickOutside(dropdownIcon, () => {
  dropdownShown.value = false;
});
</script>
