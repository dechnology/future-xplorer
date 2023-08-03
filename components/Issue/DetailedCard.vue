<template>
  <form
    @submit="handleSubmit"
    class="flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ formTitle }}</h3>
      <span class="text-sm text-gray-500">建立者：{{ issue.creator }}</span>
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <div class="relative">
        <label
          for="title"
          class="absolute -top-2 ml-2 bg-white px-1 text-xs text-gray-700"
        >
          議題名稱
        </label>
        <input
          type="text"
          id="title"
          v-model="issue.title"
          placeholder="議題名稱"
          class="h-14 w-full rounded border border-solid border-gray-500 px-3 py-4"
        />
      </div>
      <div class="relative">
        <label
          for="desc"
          class="absolute -top-2 ml-2 bg-white px-1 text-xs text-gray-700"
        >
          議題描述
        </label>
        <textarea
          id="desc"
          v-model="issue.description"
          placeholder="議題描述"
          class="h-80 w-full rounded border border-solid border-gray-500 px-3 py-4 text-start"
        ></textarea>
      </div>
    </div>
    <div class="flex items-center justify-center gap-2">
      <div v-if="issue.createdAt">
        建立時間：{{ format(issue.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="issue.updatedAt">
        建立時間：{{ format(issue.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <div v-if="state === 'new'" class="relative">
      <CardButton icon="mdi:forum-plus" body="test" />
      <button class=""></button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { Issue } from 'types/issue';

const activeIssueStore = useActiveIssueStore();
const { issue: activeIssue } = storeToRefs(activeIssueStore);

const newIssueTemplate = {
  title: '',
  description: '',
  creator: 'HEHE2',
} as Issue;

const state = ref<'new' | 'detail' | 'editing'>('new');
const formTitle = ref('新增議題');
const issue = ref<Issue>({
  title: '',
  description: '',
  creator: 'HEHE2',
});

// new: clear, create
// editing: remove, cancel, save
// detail: remove, edit, go

watch(activeIssue, (newIssue, oldIssue) => {
  if (newIssue === null) {
    issue.value = newIssueTemplate;
    return;
  }

  issue.value = { ...newIssue };
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
};
</script>

<style scoped></style>
