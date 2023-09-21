<template>
  <div class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-5">
    <InputSearchBar
      v-model="searchQuery"
      placeholder="輸入關鍵字"
      button-text="搜尋"
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

const searchQuery = ref('');
</script>
