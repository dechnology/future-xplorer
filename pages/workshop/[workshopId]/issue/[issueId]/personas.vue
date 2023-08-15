<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <PersonaPanel />
      </template>
      <PersonaGalleryPanel />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
const route = useRoute();
const issueStore = useIssueStore();
const { getTokenSilently } = await useAuth();

const token = await getTokenSilently();
const workshopId = route.params.workshopId as string;
const issueId = route.params.issueId as string;

await issueStore.init(token, workshopId, issueId);
</script>
