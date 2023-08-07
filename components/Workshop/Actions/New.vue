<template>
  <div class="relative flex items-center justify-center">
    <CardButton
      class="h-12 w-28 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi-forum-plus', size: '3rem' }"
      body="新增"
      type="submit"
    />
    <CardButton
      @click="() => store.resetCurrentWorkshop()"
      class="absolute inset-0 h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500"
      :icon="{ name: 'mdi:delete', size: '3rem' }"
      body="清除"
    />
  </div>
</template>

<script setup lang="ts">
const store = useWorkshopsStore();
</script>
