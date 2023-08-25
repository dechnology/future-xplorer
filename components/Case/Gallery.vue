<template>
  <div class="grid grid-cols-4 gap-4">
    <!-- <IconCard
      @click="() => handleClick()"
      class="h-[350px]"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '5rem' }"
      text="新增角色"
    />
    <Card
      v-for="p in personas"
      :key="p._id"
      @click="() => handleClick(p)"
      class="h-[350px]"
      :isActivated="p._id === activeId"
      :image="p.image ? p.image : null"
      :lines="[
        `角色：${p.role}`,
        `姓名：${p.name}`,
        `性別：${p.gender}`,
        `年齡：${p.age}`,
        `特徵：${p.trait}`,
      ]"
      :footnotes="[`建立者：${p.creator.name}`]"
    /> -->
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
