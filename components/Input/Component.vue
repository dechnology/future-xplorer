<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <div class="relative">
      <input
        v-if="type === 'text'"
        type="text"
        v-bind="inputProps"
        @input="handleInputChange"
      />
      <textarea
        v-else
        v-bind="inputProps"
        @input="handleInputChange"
      ></textarea>
      <div
        v-if="selectOptions"
        class="absolute inset-y-0 right-2 flex items-center justify-center"
      >
        <Icon
          @click="() => (dropdownShown = !dropdownShown)"
          class="cursor-pointer transition-all duration-300"
          :class="dropdownShown ? '-rotate-90' : 'rotate-90'"
          name="pepicons-pop:triangle-left-filled"
          size="1.25rem"
        />
      </div>
      <div
        ref="dropdownDiv"
        class="absolute right-0 top-full z-10 mt-3 w-full origin-top-right transition-all duration-300"
        :class="dropdownShown ? 'scale-100' : 'scale-0'"
      >
        <Dropdown v-if="selectOptions">
          <DropdownItem
            v-for="opt in selectOptions"
            @click="() => handleClick(opt)"
          >
            {{ opt.name }}
          </DropdownItem>
        </Dropdown>
      </div>
      <!-- <Dropdown
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
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
interface SelectOption {
  name: string;
  data: string;
}
interface Props {
  // Required
  type: 'text' | 'textarea';
  modelValue: string | number;

  // Optional
  title?: string;
  inputClasses?: string;
  selectOptions?: SelectOption[];

  // Optional with defaults
  placeholder?: string;
  disabled?: boolean;
  selectOnly?: boolean;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  disabled: false,
  selectOnly: false,
  readOnly: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const dropdownShown = ref(false);
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
      ],
      props.type === 'textarea' && 'resize-none',
      props.inputClasses,
      props.selectOptions && 'pr-12',
      props.disabled ? ['bg-slate-50'] : ['border-opacity-40']
    ),
    placeholder: props.placeholder,
    disabled: props.disabled,
    value: props.modelValue,
    readonly: props.selectOnly || props.readOnly,
  };
});

const handleInputChange = (e: Event) => {
  if (!props.selectOnly) {
    emit('update:modelValue', (e.target as HTMLInputElement).value);
  }
};

const handleClick = (option: SelectOption) => {
  emit('update:modelValue', option.data);
  dropdownShown.value = false;
};

onClickOutside(dropdownDiv, (e: PointerEvent) => {
  dropdownShown.value = false;
});
</script>
