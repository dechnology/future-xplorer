<template>
  <div :class="classes">
    <InputSearchBar
      v-if="includeSearchBar"
      placeholder="輸入關鍵字"
      button-text="搜尋"
      @search="(value) => $emit('search', value)"
    />
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  includeSearchBar?: boolean;
  inputClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
  includeSearchBar: false,
  inputClasses: '',
});

defineEmits<{
  (e: 'search', value: string): void;
}>();

const classes = computed(() =>
  twMerge('flex h-full w-full flex-col gap-5 px-4 pt-4', props.inputClasses)
);
</script>
