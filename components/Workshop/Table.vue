<template>
  <div
    class="h-full overflow-y-auto rounded-t-xl border border-solid border-gray-300"
  >
    <table class="w-full table-auto border-collapse">
      <thead class="bg-slate-100 text-xl">
        <tr>
          <th
            v-for="tableHeader in tableHeaders"
            class="border-b border-solid border-gray-300"
          >
            <div class="flex items-center justify-center py-3">
              {{ tableHeader }}
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          @click="() => (state = CardStates.New)"
          class="cursor-pointer border-b border-solid border-gray-300 transition-all ease-in-out"
          :class="[
            activeId === null
              ? 'bg-gray-200'
              : 'bg-white hover:bg-gray-100 hover:text-gray-500',
          ]"
        >
          <td class="py-5" colspan="5">
            <div class="flex items-center justify-center">
              <Icon name="mdi:plus-circle-outline" size="2rem" />
            </div>
          </td>
        </tr>
        <WorkshopTableRow
          v-for="workshop in workshops"
          :key="workshop._id"
          @dblclick="() => handleDbllick(workshop._id)"
          @click="() => handleClick(workshop)"
          :workshop="workshop"
          class="= cursor-pointer border-b border-solid border-gray-300 transition-all"
          :class="[
            activeId === workshop._id
              ? 'bg-gray-200'
              : 'bg-white hover:bg-gray-100',
          ]"
        />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types';
import { Workshop } from '@/types';

const router = useRouter();
const store = useWorkshopsStore();
const cardStore = useWorkshopCardStore();
const { workshops } = storeToRefs(store);
const { activeId, state } = storeToRefs(cardStore);
const tableHeaders = ['名稱', '工作坊時間', '建立者', '建立日期', '更新日期'];

const handleClick = (w: Workshop) => {
  cardStore.setActiveId(w._id);
  cardStore.setCurrentWorkshop(w);
  state.value = CardStates.Detail;
};

const handleDbllick = (id: string) => {
  router.push(`/workshop/${id}`);
};
</script>
