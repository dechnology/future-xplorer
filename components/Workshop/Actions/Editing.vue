<template>
  <div class="flex items-center justify-center gap-4">
    <CardButton
      @click="() => (state = WorkshopStates.Detail)"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:close-thick', size: '3rem' }"
      body="取消"
    />
    <CardButton
      class="h-12 w-28 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:content-save-edit', size: '3rem' }"
      body="儲存"
      type="submit"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { WorkshopStates } from '@/types/workshop';

const workshopStore = useWorkshopStore();
const { state } = storeToRefs(workshopStore);
</script>

<style scoped></style>
