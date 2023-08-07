<template>
  <div class="grid grid-cols-4 gap-4">
    <Card
      @click="
        () => {
          activeIssue = null;
          modalStore.setContent({});
          state = IssueStates.New;
        }
      "
      class="cursor-pointer rounded-2xl border border-solid border-gray-400 px-8 py-7 transition-all hover:shadow-2xl"
      :class="[
        activeIssue === null ? 'bg-gray-200' : 'bg-white hover:bg-gray-100',
      ]"
      :icon="{ name: 'mdi:plus', size: '10rem' }"
    />
    <Card
      v-for="issue in issues"
      @click="
        () => {
          activeIssue = issue;
          cachedIssue = issue;
          modalStore.setContent(issue);
          state = IssueStates.Detail;
        }
      "
      class="cursor-pointer rounded-2xl border border-solid border-gray-400 px-8 py-7 transition-all hover:shadow-2xl"
      :class="[
        activeIssue?.id === issue.id
          ? 'bg-gray-200'
          : 'bg-white hover:bg-gray-100',
      ]"
      :title="issue.title"
      :description="issue.description"
      :footnotes="[
        `建立者：${issue.creator}`,
        `新增日期：${formatDate(issue.createdAt)}`,
        `更新日期：${formatDate(issue.updatedAt)}`,
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { IssueStates } from '@/types/issue';

const modalStore = useModalStore();
const workshopStore = useWorkshopStore();
const { issues, activeIssue, cachedIssue, state } = storeToRefs(workshopStore);
</script>
