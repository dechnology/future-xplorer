<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <div class="relative">
      <input
        v-if="type === 'text'"
        type="text"
        v-bind="inputProps"
        @keypress.enter.prevent=""
        @input="handleInputChange"
      />
      <textarea
        v-else
        v-bind="inputProps"
        @input="handleInputChange"
      ></textarea>
      <div
        v-if="selectOptions && !disabled"
        class="absolute inset-y-0 right-2 flex items-center justify-center"
      >
        <Icon
          ref="dropdownIcon"
          class="h-4 w-4 cursor-pointer transition-all duration-300 xl:h-5 xl:w-5"
          :class="dropdownShown ? '-rotate-90' : 'rotate-90'"
          name="pepicons-pop:triangle-left-filled"
          @click="() => (dropdownShown = !dropdownShown)"
        />
      </div>
      <div
        v-if="selectOptions && !disabled"
        ref="dropdownDiv"
        class="absolute right-0 top-full z-10 mt-3 w-full origin-top-right transition-all duration-300"
        :class="dropdownShown ? 'scale-100' : 'scale-0'"
      >
        <Dropdown>
          <DropdownItem
            v-for="opt in selectOptions"
            :key="opt.name"
            @click="() => handleClick(opt)"
          >
            {{ opt.name }}
          </DropdownItem>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SelectOption } from '~/types';

interface Props {
  // Required
  type: 'text' | 'textarea' | 'select';
  modelValue: string;

  // Optional
  title?: string;
  inputClasses?: string;
  selectOptions?: SelectOption<string>[];

  // Optional with defaults
  placeholder?: string;
  disabled?: boolean;
  selectOnly?: boolean;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  inputClasses: undefined,
  selectOptions: undefined,

  placeholder: '',
  disabled: false,
  selectOnly: false,
  readOnly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const dropdownShown = ref(false);
const dropdownIcon = ref<HTMLDivElement | null>(null);
const dropdownDiv = ref<HTMLDivElement | null>(null);

const inputProps = computed(() => {
  let value = props.modelValue;

  if (props.selectOptions) {
    const opt = props.selectOptions.find(
      (opt) => opt.data === props.modelValue
    );

    if (opt) {
      value = opt.name;
    }
  }

  return {
    class: twMerge(
      [
        'w-full',
        'rounded',
        'pl-2',
        'pr-2',
        'py-2',
        'xl:pl-4',
        'xl:pr-4',
        'xl:py-4',
        'max-xl:text-xs',
      ],
      props.type === 'textarea' && 'resize-none',
      props.inputClasses,
      props.selectOptions && 'pr-8 xl:pr-12',
      props.disabled
        ? ['bg-slate-50', 'border-none', 'bg-transparent']
        : ['border-opacity-40', 'border', 'border-solid', 'border-black']
    ),
    placeholder: props.placeholder,
    disabled: props.disabled,
    readonly: props.selectOnly || props.readOnly,
    value,
  };
});

const handleInputChange = (e: Event) => {
  if (!props.selectOnly) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
  }
};

const handleClick = (option: SelectOption<string>) => {
  emit('update:modelValue', option.data);
  dropdownShown.value = false;
};

onClickOutside(dropdownIcon, () => {
  dropdownShown.value = false;
});
</script>
