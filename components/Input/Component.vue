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
interface Props {
  // Required
  type: 'text' | 'textarea';
  modelValue: string | number;

  // Optional
  title?: string;
  inputClasses?: string;
  selectOptions?: string[];

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
</script>
