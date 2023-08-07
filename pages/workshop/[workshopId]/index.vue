<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <IssuePanel />
      </template>
      <IssueGallery />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
const route = useRoute();
const store = useWorkshopStore();
await store.initStore(parseInt(route.params.workshopId as string));
</script>
