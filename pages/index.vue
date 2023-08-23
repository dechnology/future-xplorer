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
const { workshops } = storeToRefs(store);
const { getTokenSilently } = await useAuth();

onMounted(async () => {
  const token = await getTokenSilently();
  await store.init(token);
  console.log('workshops: ', workshops.value);
});
</script>
