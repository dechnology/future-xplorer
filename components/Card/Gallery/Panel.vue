<template>
  <div class="flex h-full flex-col gap-5">
    <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <slot />
    <!-- <IssueGallery class="overflow-y-auto" /> -->
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
</script>
