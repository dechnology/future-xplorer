<template>
  <div class="grid grid-cols-4 gap-4">
    <IconCard
      @click="() => handleClick()"
      class="h-80"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '5rem' }"
      text="新增案例"
    />
    <Card
      class="h-80"
      v-for="c in cases"
      :key="c._id"
      @click="() => handleClick(c)"
      :isActivated="c._id === activeId"
      :image="c.image"
      :lines="[`標題：${c.title}`, `目標：${c.goal}`, `作法：${c.method}`]"
      :footnotes="[`建立者：${c.creator.name}`]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import type { Case } from '@/types';
import { CardStates } from '@/types';

const issueStore = useIssueStore();
const modalStore = useModalStore();
const cardStore = useCaseCardStore();
const { cases } = storeToRefs(issueStore);
const { activeId, state } = storeToRefs(cardStore);

const handleClick = (c?: Case) => {
  if (c) {
    modalStore.setContent(c);
    cardStore.setActiveId(c._id);
    cardStore.setCurrentCase(c);
    state.value = CardStates.Detail;
  } else {
    modalStore.setContent({});
    state.value = CardStates.New;
  }
};
</script>
