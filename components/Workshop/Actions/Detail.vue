<template>
  <div class="relative flex items-center justify-between">
    <CardButton
      @click="handleRemoveWorkshopClick"
      class="h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500"
      :icon="{ name: 'mdi:delete', size: '3rem' }"
      body="刪除"
    />
    <CardButton
      class="h-12 w-28 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:play', size: '3rem' }"
      body="開始"
      type="submit"
    />
    <CardButton
      @click="handleEditWorkshopClick"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:application-edit', size: '3rem' }"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { WorkshopStates } from '@/types/workshop';

const workshopsStore = useWorkshopsStore();
const { currentWorkshop, state, activeWorkshop } = storeToRefs(workshopsStore);

const handleRemoveWorkshopClick = (e: Event) => {
  console.log(currentWorkshop.value);
  // TODO
};

const handleEditWorkshopClick = (e: Event) => {
  console.log(currentWorkshop.value);
  state.value = WorkshopStates.Editing;
};
</script>

<style scoped></style>
