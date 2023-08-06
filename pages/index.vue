<template>
  <NuxtLayout>
    <template #detail-pane>
      <h2 class="mb-5 text-3xl font-bold">場次列表</h2>
      <p class="mb-7 text-base">工作坊的管理頁面：管理工作坊的活動場次</p>
      <WorkshopCard />
    </template>
    <div
      class="overflow-hidden rounded-t-xl border border-solid border-gray-300"
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
          <WorkshopTableRow
            v-for="workshop in workshops"
            :workshop="workshop"
            class="cursor-pointer border-b border-solid border-gray-300 transition-all hover:bg-gray-100"
          />
        </tbody>
      </table>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Workshop } from '@/types/workshop';
import { convertDateStr } from '@/utils/date';

const tableHeaders = ['名稱', '工作坊時間', '建立者', '建立日期', '更新日期'];

const { data } = await useFetch('/api/workshops');
const workshops = ref<(Workshop | null)[] | undefined>(
  data.value?.map((workshop) => ({
    ...workshop,
    createdAt: convertDateStr(workshop.createdAt),
    updatedAt: convertDateStr(workshop.updatedAt),
    startAt: convertDateStr(workshop.startAt),
    endAt: convertDateStr(workshop.endAt),
  }))
);
workshops.value?.unshift(null);
</script>
