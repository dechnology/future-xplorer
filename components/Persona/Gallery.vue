<template>
  <div class="grid grid-cols-4 gap-4 rounded-2xl">
    <IconCard
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
      :image="p.image"
      :lines="[
        `角色：${p.role}`,
        `姓名：${p.name}`,
        `性別：${p.gender}`,
        `年齡：${p.age}`,
        `特徵：${p.trait}`,
      ]"
      :footnotes="[`建立者：${p.creator.name}`]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Persona } from '@/types/persona';
import { CardStates } from '@/types/cardState';

const issueStore = useIssueStore();
const modalStore = useModalStore();
const cardStore = usePersonaCardStore();
const { personas } = storeToRefs(issueStore);
const { activeId, state } = storeToRefs(cardStore);

console.log(personas.value);

const handleClick = (p?: Persona) => {
  if (p) {
    // modalStore.setContent(p);
    cardStore.setActivePersona(p);
    cardStore.setCurrentPersona(p);
    state.value = CardStates.Detail;
  } else {
    modalStore.setContent({});
    state.value = CardStates.New;
  }
};
</script>
