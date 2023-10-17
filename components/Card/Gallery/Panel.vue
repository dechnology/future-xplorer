<template>
  <div class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-5">
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
}

withDefaults(defineProps<Props>(), {
  includeSearchBar: true,
});

defineEmits<{
  (e: 'search', value: string): void;
}>();

const searchQuery = ref('');
</script>
