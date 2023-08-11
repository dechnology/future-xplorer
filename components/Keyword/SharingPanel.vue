<template>
  <div class="flex flex-col gap-2 overflow-hidden">
    <KeywordTab v-model="tab" />
    <div class="flex gap-14 overflow-hidden">
      <KeywordGallery class="flex-1 overflow-y-auto" />
      <KeywordGallery class="flex-1 overflow-y-auto" />
    </div>
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
