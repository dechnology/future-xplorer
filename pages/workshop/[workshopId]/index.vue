<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <IssuePaneDetail />
      </template>
      <IssuePaneGallery />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const route = useRoute();
const issueStore = useIssueStore();
const { loading } = storeToRefs(issueStore);

await issueStore.initStore(parseInt(route.params.workshopId as string));
</script>
