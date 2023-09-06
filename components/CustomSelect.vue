<template>
  <KeywordHeader class="relative">
    <slot :selected="selected" />
    <span v-if="options">
      <Icon
        @click="() => (dropdownShown = !dropdownShown)"
        class="cursor-pointer transition-all duration-300"
        :class="dropdownShown && '-rotate-90'"
        name="pepicons-pop:triangle-left-filled"
      />
    </span>
    <div
      ref="dropdownDiv"
      class="absolute right-0 top-full z-10 mt-3 w-full origin-top-right transition-all duration-300"
      :class="dropdownShown ? 'scale-100' : 'scale-0'"
    >
      <Dropdown>
        <DropdownItem
          v-for="opt in options"
          @click="() => handleClick(opt)"
          :active="selected.name === opt.name"
        >
          {{ opt.name }}
        </DropdownItem>
      </Dropdown>
    </div>
  </KeywordHeader>
</template>

<script setup lang="ts" generic="T">
interface Option {
  name: string;
  data: T;
}
interface Props {
  modelValue: T;
  options: Option[];
}
const props = defineProps<Props>();

const emit = defineEmits<{ (e: 'update:modelValue', data: T): void }>();

const selected = shallowRef<Option>(props.options[0]);
const dropdownShown = ref(false);
const dropdownDiv = ref<HTMLDivElement | null>(null);

const handleClick = (option: Option) => {
  selected.value = option;
  emit('update:modelValue', option.data);
  dropdownShown.value = false;
};

onClickOutside(dropdownDiv, (e: PointerEvent) => {
  dropdownShown.value = false;
});
</script>
