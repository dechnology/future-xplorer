<template>
  <div class="flex items-center justify-center gap-4">
    <CardButton
      @click.prevent="handleClick"
      class="h-12 w-28 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi:close-thick', size: '3rem' }"
      body="取消"
    />
    <CardButton
      class="h-12 w-28 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:content-save-edit', size: '3rem' }"
      body="儲存"
    />
  </div>
</template>

<script setup lang="ts">
import { CardStates } from '@/types';

const issueStore = useIssueStore();
const cardStore = usePersonaCardStore();
const { issue } = storeToRefs(issueStore);
const { activeId, state } = storeToRefs(cardStore);

const handleClick = () => {
  if (!activeId.value) {
    console.error('no active persona');
    return;
  }

  if (!issue.value) {
    console.error('no issue');
    return;
  }

  const personas = issue.value.personas;
  const activeIndex = personas.findIndex((p) => p._id === activeId.value);
  if (activeIndex === -1) {
    console.error('active persona not found');
    return;
  }

  const activePersona = personas[activeIndex];
  cardStore.setCurrentPersona(activePersona);
  state.value = CardStates.Detail;
};
</script>

<style scoped></style>
