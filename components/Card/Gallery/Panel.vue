<template>
  <div class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-5">
    <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <slot />
    <!-- <IssueGallery class="overflow-y-auto" /> -->
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
</script>
