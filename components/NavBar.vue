<template>
  <div
    class="flex items-center justify-between bg-primary-500 px-12 text-white"
  >
    <div class="flex items-center gap-3">
      <img
        class="h-8 fill-current text-white"
        src="~/assets/logo.svg"
        alt="logo"
      />
      <h1 class="my-6 text-2xl">{{ heading }}</h1>
    </div>
    <Icon size="1.75rem" name="mdi:logout" />
  </div>
</template>

<script setup lang="ts">
const heading = '未來情境探索輔助工具';
</script>

<style scoped></style>
