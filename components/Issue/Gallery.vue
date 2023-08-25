<template>
  <div class="grid grid-cols-4 gap-4 rounded-2xl">
    <IconCard
      @click="() => handleClick()"
      class="h-[300px]"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '5rem' }"
      text="新增議題"
    />
    <Card
      v-for="i in issues"
      :key="i._id"
      @dblclick="() => handleDblclick(i._id)"
      @click="() => handleClick(i)"
      class="h-[300px]"
      :is-activated="activeId === i._id"
      :title="i.title"
      :description="i.description"
      :footnotes="[
        `建立者：${i.creator.name}`,
        `新增日期：${formatDate(i.createdAt)}`,
        `更新日期：${formatDate(i.updatedAt)}`,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { CardStates } from '@/types';
import type { BaseIssue } from '@/types';

const route = useRoute();
const router = useRouter();
const store = useWorkshopStore();
const cardStore = useIssueCardStore();
const { issues } = storeToRefs(store);
const { activeId, state } = storeToRefs(cardStore);

const handleClick = (issue?: BaseIssue) => {
  if (issue) {
    cardStore.setActiveIssue(issue);
    cardStore.setCurrentIssue(issue);
    state.value = CardStates.Detail;
  } else {
    state.value = CardStates.New;
  }
};

const handleDblclick = (id: string) => {
  router.push(`${route.fullPath.replace(/\/+$/, '')}/issue/${id}/personas`);
};
</script>
