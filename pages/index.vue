<template>
  <NuxtLayout>
    <template #detail-pane>
      <WorkshopPanel />
    </template>
    <WorkshopTable />
  </NuxtLayout>
</template>

<script setup lang="ts">
const store = useWorkshopsStore();
await store.initStore();
</script>
