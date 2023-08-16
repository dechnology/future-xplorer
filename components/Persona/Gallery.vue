<template>
  <div class="grid grid-cols-4 gap-4 rounded-2xl">
    <Card
      @click="() => handleClick()"
      classes="h-[350px]"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <ImageCard
      v-for="persona in personas"
      :key="persona._id"
      @click="() => handleClick(persona)"
      class="h-[350px]"
      :isActivated="persona._id === activeId"
      :image="persona.image"
      :lines="[
        `角色：${persona.role}`,
        `姓名：${persona.name}`,
        `性別：${persona.gender}`,
        `年齡：${persona.age}`,
        `特徵：${persona.trait}`,
      ]"
      :footnotes="[`建立者：${persona.creator.name}`]"
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

const handleClick = (p?: Persona) => {
  if (p) {
    modalStore.setContent(p);
    cardStore.setActiveId(p._id);
    cardStore.setCurrentPersona(p);
    state.value = CardStates.Detail;
  } else {
    modalStore.setContent({});
    state.value = CardStates.New;
  }
};
</script>
types/persona
