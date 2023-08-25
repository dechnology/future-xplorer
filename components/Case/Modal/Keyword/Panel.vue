<template>
  <div class="flex h-full flex-col gap-5">
    <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <CaseModalKeywordGallery
      class="auto shrink grow overflow-y-auto p-2"
      :n_cols="2"
      :include-add-card="true"
      :show-category="false"
    />
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
</script>
