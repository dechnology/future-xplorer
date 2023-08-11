<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <TemplatePanel />
      </template>
      <TemplateGalleryPanel />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'half',
});

const route = useRoute();

const issueStore = useIssueStore();
await issueStore.init(
  route.params.workshopId as string,
  route.params.issueId as string
);
</script>
