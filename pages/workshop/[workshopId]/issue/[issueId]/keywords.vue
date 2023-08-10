<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <KeywordUnsortedPanel />
      </template>
      <KeywordSortedPanel />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

definePageMeta({
  layout: 'half',
});

const route = useRoute();

const issueStore = useIssueStore();
await issueStore.init(
  route.params.workshopId as string,
  route.params.issueId as string
);

const {} = storeToRefs(issueStore);
</script>
