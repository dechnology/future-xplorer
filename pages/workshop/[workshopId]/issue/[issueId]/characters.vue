<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <CharacterPanel />
      </template>
      <CharacterGallery />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const route = useRoute();

const issueStore = useIssueStore();
await issueStore.initStore(
  route.params.workshopId as string,
  route.params.issueId as string
);

const {} = storeToRefs(issueStore);
</script>
