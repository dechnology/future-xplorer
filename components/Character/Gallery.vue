<template>
  <div class="grid grid-cols-4 gap-4">
    <Card
      @click="
        () => {
          state = CardStates.New;
        }
      "
      :isActivated="activeCharacter === null"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <Card
      v-for="charater in charaters"
      :key="charater.id"
      @click="
        () => {
          cardStore.setActiveCharacter(charater);
          cardStore.setCurrentCharacter(charater);
          state = CardStates.Detail;
        }
      "
      :isActivated="charater.id === activeCharacter?.id"
      :imageUrl="charater.imageUrl"
      :lines="[
        `角色：${charater.role}`,
        `姓名：${charater.name}`,
        `性別：${charater.gender}`,
        `年齡：${charater.age}`,
        `特徵：${charater.trait}`,
      ]"
      :footnotes="[`建立者：${charater.creatorId}`]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';
const issueStore = useIssueStore();
const cardStore = useCharacterCardStore();
const { charaters } = storeToRefs(issueStore);
const { activeCharacter, state } = storeToRefs(cardStore);
</script>
