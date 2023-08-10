<template>
  <div class="flex flex-col gap-5 overflow-hidden">
    <h2 class="text-3xl font-bold">關鍵字整理</h2>
    <p class="text-base">
      第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。
    </p>
    <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <div class="flex grow flex-col gap-5 overflow-hidden">
      <KeywordGallery class="h-full overflow-y-auto" :n_cols="2" draggable />
    </div>
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('');
</script>
