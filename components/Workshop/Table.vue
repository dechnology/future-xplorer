<template>
  <div class="overflow-hidden rounded-t-xl border border-solid border-gray-300">
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
          @click="
            () => {
              activeWorkshop = null;
              state = WorkshopStates.New;
            }
          "
          class="cursor-pointer border-b border-solid border-gray-300 transition-all ease-in-out"
          :class="[
            activeWorkshop === null
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
          @click="
            () => {
              activeWorkshop = workshop;
              state = WorkshopStates.Detail;
            }
          "
          :workshop="workshop"
          class="= cursor-pointer border-b border-solid border-gray-300 transition-all"
          :class="[
            activeWorkshop?.id === workshop.id
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
import { WorkshopStates } from '@/types/workshop';

const workshopStore = useWorkshopStore();
const { workshops, activeWorkshop, state } = storeToRefs(workshopStore);

const tableHeaders = ['名稱', '工作坊時間', '建立者', '建立日期', '更新日期'];
</script>
