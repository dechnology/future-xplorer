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
import { storeToRefs } from 'pinia';

console.log('workshop page');

const route = useRoute();
const store = useIssuesStore();
const breadcrumbStore = useBreadcrumbStore();
const { workshop } = storeToRefs(store);
const { getTokenSilently } = await useAuth();

const workshopId = route.params.workshopId as string;

const token = await getTokenSilently();
await store.init(token, workshopId);

breadcrumbStore.clearIssue();
if (workshop.value) {
  breadcrumbStore.setWorkshop(workshop.value.name, route.fullPath);
}
</script>
