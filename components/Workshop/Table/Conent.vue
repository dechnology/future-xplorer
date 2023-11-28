<template>
  <WorkshopTableRow
    v-for="el in workshops"
    :key="el._id"
    :active="el._id === activeId"
    @dblclick="() => handleDblclick(el._id)"
    @click="() => (activeWorkshop = el)"
  >
    <WorkshopTableData
      v-for="(datum, idx) in getWorkshopData(el)"
      :key="`${idx}_${datum}`"
    >
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
const { workshops, activeWorkshop, activeId } = storeToRefs(stores.workshops);

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
