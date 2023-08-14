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
const { getTokenSilently } = await useAuth();
const token = await getTokenSilently();
await store.init(token);
</script>
