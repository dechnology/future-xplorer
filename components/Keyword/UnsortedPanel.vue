<template>
  <h2 class="mb-5 text-3xl font-bold">關鍵字整理</h2>
  <p class="mb-7 text-base">
    第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。
  </p>
  <div class="flex flex-col gap-2">
    <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <KeywordGallery />
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
</script>
