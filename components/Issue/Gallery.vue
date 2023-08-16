<template>
  <div class="grid grid-cols-4 justify-items-start gap-4 rounded-2xl">
    <Card
      @click="() => handleClick()"
      classes="h-[300px]"
      :is-activated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <Card
      v-for="issue in issues"
      :key="issue._id"
      @dblclick="() => handleDblclick(issue._id)"
      @click="() => handleClick(issue)"
      classes="h-[300px]"
      :is-activated="activeId === issue._id"
      :title="issue.title"
      :description="issue.description"
      :footnotes="[
        `建立者：${issue.creator.name}`,
        `新增日期：${formatDate(issue.createdAt)}`,
        `更新日期：${formatDate(issue.updatedAt)}`,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';
import { BaseIssue } from '@/types/issue';

const route = useRoute();
const router = useRouter();

const store = useIssuesStore();
const cardStore = useIssueCardStore();
const modalStore = useModalStore();

const { issues } = storeToRefs(store);
const { activeId, state } = storeToRefs(cardStore);

const handleClick = (issue?: BaseIssue) => {
  if (issue) {
    modalStore.setContent(issue);
    cardStore.setActiveId(issue._id);
    cardStore.setCurrentIssue(issue);
    state.value = CardStates.Detail;
  } else {
    modalStore.setContent({});
    state.value = CardStates.New;
  }
};

const handleDblclick = (id: string) => {
  router.push(`${route.fullPath.replace(/\/+$/, '')}/issue/${id}/personas`);
};
</script>
