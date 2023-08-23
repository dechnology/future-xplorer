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
import { CardStates } from '@/types';

const issueStore = useIssueStore();
const cardStore = useCaseCardStore();
const { issue } = storeToRefs(issueStore);
const { activeId, state } = storeToRefs(cardStore);

const handleClick = () => {
  if (!activeId.value) {
    console.error('no active case');
    return;
  }

  if (!issue.value) {
    console.error('no issue');
    return;
  }

  const cases = issue.value.cases;
  const activeIndex = cases.findIndex((c) => c._id === activeId.value);
  if (activeIndex === -1) {
    console.error('active case not found');
    return;
  }

  const activeCase = cases[activeIndex];
  cardStore.setCurrentCase(activeCase);
  state.value = CardStates.Detail;
};
</script>
