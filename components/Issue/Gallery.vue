<template>
  <div class="grid grid-cols-4 gap-4">
    <Card
      @click="
        () => {
          modalStore.setContent({});
          state = CardStates.New;
        }
      "
      :is-activated="activeIssue === null"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <Card
      v-for="issue in issues"
      @dblclick="
        () =>
          $router.push(
            `${$route.fullPath.replace(/\/+$/, '')}/issue/${
              issue?.id
            }/characters`
          )
      "
      @click="
        () => {
          modalStore.setContent(issue);
          cardStore.setActiveIssue(issue);
          cardStore.setCurrentIssue(issue);
          state = CardStates.Detail;
        }
      "
      :is-activated="activeIssue?.id === issue.id"
      :title="issue.title"
      :description="issue.description"
      :footnotes="[
        `建立者：${issue.creatorId}`,
        `新增日期：${formatDate(issue.createdAt)}`,
        `更新日期：${formatDate(issue.updatedAt)}`,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';

const store = useIssuesStore();
const cardStore = useIssueCardStore();
const modalStore = useModalStore();
const { issues } = storeToRefs(store);
const { activeIssue, state } = storeToRefs(cardStore);
</script>
