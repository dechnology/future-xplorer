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
const route = useRoute();
const issueStore = useIssueStore();
await issueStore.initStore(parseInt(route.params.workshopId as string));
</script>
