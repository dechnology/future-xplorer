<template>
  <KeywordHeader class="relative">
    <slot :selected="selected" />
    <span>
      <Icon
        class="h-4 w-4 cursor-pointer transition-all duration-300 xl:h-6 xl:w-6"
        :class="dropdownShown && '-rotate-90'"
        name="pepicons-pop:triangle-left-filled"
        @click="() => (dropdownShown = !dropdownShown)"
      />
    </span>
    <div
      ref="dropdownDiv"
      class="absolute right-0 top-full z-10 mt-2 w-full origin-top-right transition-all duration-300 xl:mt-3"
      :class="dropdownShown ? 'scale-100' : 'scale-0'"
    >
      <Dropdown>
        <DropdownItem
          v-for="opt in options"
          :key="`${opt.name}_${opt.data}`"
          :active="selected && isEqual(selected.data, opt.data)"
          @click="() => handleClick(opt)"
        >
          {{ opt.name }}
        </DropdownItem>
      </Dropdown>
    </div>
  </KeywordHeader>
</template>

<script setup lang="ts" generic="T">
import isEqual from 'lodash/isEqual';
interface Option {
  name: string;
  data: T;
}
interface Props {
  modelValue: T;
  options: Option[];
}
defineProps<Props>();

const emit = defineEmits<{ (e: 'update:modelValue', data: T): void }>();

const selected = shallowRef<Option>();
const dropdownShown = ref(false);
const dropdownDiv = ref<HTMLDivElement | null>(null);

const handleClick = (option: Option) => {
  selected.value = option;
  emit('update:modelValue', option.data);
  dropdownShown.value = false;
};

onClickOutside(dropdownDiv, () => {
  dropdownShown.value = false;
});
</script>
