<template>
  <div class="flex items-center justify-center gap-4">
    <CardButton
      @click="handleClick"
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
import { CardStates } from '@/types';

const store = useIssuesStore();
const cardStore = useIssueCardStore();
const { activeId, state } = storeToRefs(cardStore);

const handleClick = () => {
  if (!activeId.value) {
    console.error('no active workshop');
    return;
  }

  const activeIssue = store.findById(activeId.value);

  if (!activeIssue) {
    console.error('no active workshop');
    return;
  }

  cardStore.setCurrentIssue(activeIssue);
  state.value = CardStates.Detail;
};
</script>
