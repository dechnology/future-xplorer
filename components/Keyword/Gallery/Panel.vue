<template>
  <div :class="classes">
    <InputSearchBar
      v-if="includeSearchBar"
      v-model="searchQuery"
      placeholder="輸入關鍵字"
      button-text="搜尋"
      @search="$emit('search', searchQuery)"
    />
    <slot :search-query="searchQuery" />
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
  twMerge(
    'flex h-full min-h-0 shrink grow basis-auto flex-col gap-5 px-4 pt-4',
    props.inputClasses
  )
);

const searchQuery = ref('');
</script>
