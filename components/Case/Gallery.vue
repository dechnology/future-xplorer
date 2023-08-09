<template>
  <div class="grid grid-cols-4 gap-4">
    <Card
      @click="
        () => {
          state = CardStates.New;
        }
      "
      :isActivated="activeCase === null"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <Card
      v-for="_case in cases"
      :key="_case.id"
      @click="
        () => {
          cardStore.setActiveCase(_case);
          cardStore.setCurrentCase(_case);
          state = CardStates.Detail;
        }
      "
      :isActivated="_case.id === activeCase?.id"
      :imageUrl="_case.imageUrl"
      :lines="[
        `標題：${_case.title}`,
        `目標：${_case.goal}`,
        `作法：${_case.method}`,
      ]"
      :footnotes="[`建立者：${_case.creatorId}`]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';
const issueStore = useIssueStore();
const cardStore = useCaseCardStore();
const { cases } = storeToRefs(issueStore);
const { activeCase, state } = storeToRefs(cardStore);
</script>
