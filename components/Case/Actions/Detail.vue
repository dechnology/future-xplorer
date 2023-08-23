<template>
  <div class="relative flex items-center justify-between">
    <CardButton
      class="h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500"
      :icon="{ name: 'mdi:delete', size: '3rem' }"
      body="刪除"
    />
    <CardButton
      @click.prevent="handleEditClick"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:application-edit', size: '3rem' }"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { CardStates } from '@/types';

const store = useCaseCardStore();
const { state } = storeToRefs(store);

const handleEditClick = () => {
  state.value = CardStates.Editing;
};
</script>
