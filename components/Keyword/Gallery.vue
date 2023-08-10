<template>
  <div class="grid grid-cols-2 gap-2">
    <div
      v-for="k in keywords"
      :key="k.id"
      class="flex h-40 flex-col gap-2 rounded-lg bg-white px-4 py-5"
    >
      <div class="w-fit rounded-2xl bg-slate-400 px-3 py-1 text-sm text-white">
        {{ k.category || '未分類' }}
      </div>
      <h4 class="text-2xl font-bold text-primary-500">{{ k.body }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

interface Props {
  categoryFilter?: string;
}

const props = defineProps<Props>();

const issueStore = useIssueStore();
const { keywords } = storeToRefs(issueStore);
</script>
