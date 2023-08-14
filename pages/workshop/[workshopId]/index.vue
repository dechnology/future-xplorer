<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <IssuePanel />
      </template>
      <IssueGalleryPanel />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
const route = useRoute();
const store = useIssuesStore();
const { getTokenSilently } = await useAuth();
const token = await getTokenSilently();
await store.init(token, route.params.workshopId as string);
</script>
