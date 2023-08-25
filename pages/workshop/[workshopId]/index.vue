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
const store = useWorkshopStore();
const breadcrumbStore = useBreadcrumbStore();
const { workshop } = storeToRefs(store);

onMounted(async () => {
  const { getTokenSilently } = await useAuth();
  const token = await getTokenSilently();
  const workshopId = route.params.workshopId as string;
  await store.init(token, workshopId);

  breadcrumbStore.clearIssue();
  if (workshop.value) {
    breadcrumbStore.setWorkshop(workshop.value.name, route.fullPath);
  }
});
</script>
