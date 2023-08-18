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
import { storeToRefs } from 'pinia';

console.log('persona page');

const route = useRoute();
const workshopId = route.params.workshopId as string;
const issueId = route.params.issueId as string;

const issueStore = useIssueStore();
const breadcrumbStore = useBreadcrumbStore();
const { workshop, issue } = storeToRefs(issueStore);

const { getTokenSilently } = await useAuth();
const token = await getTokenSilently();

await issueStore.init(token, workshopId, issueId);

breadcrumbStore.setWorkshop(
  workshop.value ? workshop.value.name : 'error',
  `/workshop/${workshopId}`
);
breadcrumbStore.setIssue(
  issue.value ? issue.value.title : 'error',
  route.fullPath
);
</script>
