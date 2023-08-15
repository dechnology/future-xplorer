<template>
  <div class="relative flex items-center justify-between">
    <CardButton
      class="h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500"
      :icon="{ name: 'mdi:delete', size: '3rem' }"
      body="刪除"
      type="submit"
    />
    <CardButton
      @click="handleStartClick"
      class="h-12 w-28 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:play', size: '3rem' }"
      body="開始"
    />
    <CardButton
      @click="handleEditClick"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:application-edit', size: '3rem' }"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';

const router = useRouter();
const store = useWorkshopCardStore();
const { currentWorkshop, activeId, state } = storeToRefs(store);

const handleStartClick = (e: Event) => {
  router.push(`/workshop/${activeId.value}`);
};

const handleEditClick = (e: Event) => {
  console.log(currentWorkshop.value);
  state.value = CardStates.Editing;
};
</script>

<style scoped></style>
