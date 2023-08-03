<template>
  <div
    v-if="issue"
    @click="handleClick"
    class="flex h-80 basis-1/5 cursor-pointer flex-col justify-between gap-4 rounded-2xl border border-solid border-gray-500 p-8"
    :class="[isActive ? 'bg-primary-300' : 'bg-white']"
  >
    <h3 class="text-2xl font-bold">{{ issue.title }}</h3>
    <p class="flex-grow overflow-hidden">
      {{ issue.description }}
    </p>
    <div class="mt-auto flex flex-col items-end text-[10px] text-gray-300">
      <div>建立者：{{ issue.creator }}</div>
      <div v-if="issue.createdAt">
        新增時間：{{ format(issue.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="issue.updatedAt">
        更新時間：{{ format(issue.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
  </div>
  <div
    v-else
    @click="handleClick"
    class="flex h-80 basis-1/5 cursor-pointer items-center justify-center rounded-2xl border border-solid border-gray-500"
  >
    <Icon class="text-gray-300" name="mdi:plus" size="10rem" />
  </div>
</template>

<script setup lang="ts">
import { Issue } from 'types/issue';
import { format } from 'date-fns';

interface Props {
  issue: Issue | null;
}
const props = defineProps<Props>();
const activeIssueStore = useActiveIssueStore();
const isActive = computed(() => activeIssueStore.issue?.id === props.issue?.id);
const handleClick = (e: Event) => {
  activeIssueStore.issue = props.issue;
};
</script>
