<template>
  <WorkshopTableRow
    v-for="w in workshops"
    :key="w._id"
    :active="w._id === activeId"
    @dblclick="() => handleDblclick(w._id)"
    @click="() => stores.workshops.changeActiveWorkshop(w)"
  >
    <WorkshopTableData v-for="datum in getWorkshopData(w)">
      {{ datum }}
    </WorkshopTableData>
  </WorkshopTableRow>
</template>

<script setup lang="ts">
import { Workshop } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  workshops: useWorkshopsStore(),
};
const { workshops, activeId } = storeToRefs(stores.workshops);

const getWorkshopData = (w: Workshop) => [
  w.name,
  `${w.dateValue.start} - ${w.dateValue.end}`,
  w.creator.name,
  formatDate(w.createdAt),
  formatDate(w.updatedAt),
];

const handleDblclick = (id: string) => {
  const router = useRouter();
  router.push(`/workshop/${id}`);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.workshops.init(token);
});
</script>
