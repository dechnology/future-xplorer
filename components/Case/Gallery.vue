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
      v-for="c in cases"
      @click="() => handleClick(c)"
      @dblclick="() => modalStore.show()"
      class="h-80"
      :key="c._id"
      :isActivated="c._id === activeId"
      :image="c.image ? c.image : null"
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
const keywordStore = useKeywordStore();
const modalStore = useModalStore();
const cardStore = useCaseCardStore();
const { cases } = storeToRefs(issueStore);
const { activeId, activeCaseKeywords, state } = storeToRefs(cardStore);

const handleClick = (c?: Case) => {
  if (c) {
    cardStore.setActiveCase(c);
    cardStore.setCurrentCase(c);
    keywordStore.setKeywords(activeCaseKeywords.value);
    state.value = CardStates.Detail;
  } else {
    state.value = CardStates.New;
  }
};
</script>
