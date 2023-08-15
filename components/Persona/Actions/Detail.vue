<template>
  <div class="relative flex items-center justify-between">
    <CardButton
      @click="handleRemoveClick"
      class="h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500"
      :icon="{ name: 'mdi:delete', size: '3rem' }"
      body="刪除"
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

const store = usePersonaCardStore();
const { currentPersona, state } = storeToRefs(store);

const handleRemoveClick = (e: Event) => {
  console.log(currentPersona.value);
  // TODO
};

const handleEditClick = (e: Event) => {
  console.log(currentPersona.value);
  state.value = CardStates.Editing;
};
</script>

<style scoped></style>
