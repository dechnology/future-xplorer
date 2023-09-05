<template>
  <div class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-5 p-4">
    <slot />
    <!-- <InputSearchBar v-model="searchQuery" placeholder="輸入關鍵字" />
    <KeywordGallery
      class="auto shrink grow overflow-y-auto p-2"
      :n_cols="2"
      include-add-card
      include-new-keywords
      :show-category="false"
    /> -->
  </div>
</template>
