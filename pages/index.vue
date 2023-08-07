<template>
  <NuxtLayout>
    <template #detail-pane>
      <WorkshopPaneDetail />
    </template>
    <WorkshopPaneTable />
  </NuxtLayout>
</template>

<script setup lang="ts">
const workshopStore = useWorkshopStore();
await workshopStore.initStore();
</script>
