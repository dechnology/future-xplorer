<template>
  <div class="relative flex items-center justify-between">
    <CardButton
      @click="handleRemoveIssueClick"
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
      @click="handleEditIssueClick"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:application-edit', size: '3rem' }"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { IssueStates } from '@/types/issue';

const store = useWorkshopStore();
const { currentIssue, state, activeIssue } = storeToRefs(store);

const handleRemoveIssueClick = (e: Event) => {
  console.log(currentIssue.value);
  // TODO
};

const handleEditIssueClick = (e: Event) => {
  console.log(currentIssue.value);
  state.value = IssueStates.Editing;
};
</script>

<style scoped></style>
