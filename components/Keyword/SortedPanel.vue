<template>
  <div class="flex h-full flex-col gap-6">
    <KeywordTab v-model="tab" />
    <KeywordGallery class="grow" :category-filter="tab" />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const route = useRoute();

const issueStore = useIssueStore();
await issueStore.init(
  route.params.workshopId as string,
  route.params.issueId as string
);
const { elements } = storeToRefs(issueStore);

const tabs = elements.value.map((el) => el.name);
const tab = ref(tabs[0]);
</script>
