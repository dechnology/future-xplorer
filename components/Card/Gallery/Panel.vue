<template>
  <div
    class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-2 xl:gap-5"
  >
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
}

withDefaults(defineProps<Props>(), {
  includeSearchBar: true,
});

defineEmits<{
  (e: 'search', value: string): void;
}>();
</script>
