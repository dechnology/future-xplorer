<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ state.formTitle }}</h3>
      <span class="text-sm text-gray-500"
        >建立者：{{ currentWorkshop.creatorId }}</span
      >
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <div class="flex flex-col gap-4">
        <label
          for="title"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          工作坊名稱
        </label>
        <input
          type="text"
          id="title"
          placeholder="工作坊名稱"
          v-model="currentWorkshop.name"
          class="h-16"
          :disabled="state.name == WorkshopStates.Detail.name"
          :class="commonInputClasses"
        />
      </div>
      <div class="flex flex-col gap-4">
        <label
          for="desc"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          工作坊描述
        </label>
        <textarea
          id="desc"
          placeholder="工作坊描述"
          v-model="currentWorkshop.description"
          class="h-28 resize-none text-start"
          :disabled="state.name == WorkshopStates.Detail.name"
          :class="commonInputClasses"
        ></textarea>
      </div>
      <div class="flex flex-col gap-4">
        <label
          for="duration"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          工作坊時間
        </label>
        <DatePicker
          i18n="zh-tw"
          separator=" - "
          :formatter="{ date: 'YYYY/MM/DD' }"
          v-model="dateValue"
        />
      </div>
      <div class="text-center">預先設定工作坊POEMS分類</div>
      <div v-for="el in currentWorkshop.elements" class="flex flex-col gap-4">
        <label
          for="duration"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          {{ el.name }} - {{ el.description }}
        </label>
        <ChipInput :chips="el.items as Chip[]" />
      </div>
    </div>
    <div
      v-if="currentWorkshop.createdAt || currentWorkshop.updatedAt"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentWorkshop.createdAt">
        建立時間：{{ formatDate(currentWorkshop.createdAt) }}
      </div>
      <div v-if="currentWorkshop.updatedAt">
        建立時間：{{ formatDate(currentWorkshop.updatedAt) }}
      </div>
    </div>
    <WorkshopActionsNew v-if="state.name === WorkshopStates.New.name" />
    <WorkshopActionsDetail v-if="state.name === WorkshopStates.Detail.name" />
    <WorkshopActionsEditing v-if="state.name === WorkshopStates.Editing.name" />
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { WorkshopStates } from '@/types/workshop';
import { ClassNameValue, twMerge } from 'tailwind-merge';
import { Chip } from '@/types/chip';

interface DateValue {
  start: Date;
  end: Date;
}

const router = useRouter();

const workshopsStore = useWorkshopsStore();
const { activeWorkshop, currentWorkshop, state } = storeToRefs(workshopsStore);

const poemsElements = [];

const now = new Date();
const dateValue = ref<DateValue>({
  start: now,
  end: now,
});

const defaultInputClasses: ClassNameValue = [
  'w-full',
  'rounded',
  'px-3',
  'py-4',
  'border',
  'border-solid',
  'border-gray-200',
];
const commonInputClasses = computed(() => {
  if (state.value.name === WorkshopStates.Detail.name) {
    return twMerge(defaultInputClasses, 'bg-slate-50');
  }
  return twMerge(defaultInputClasses, ['border-gray-500', 'bg-white']);
});

const handleSubmit = (e: Event) => {
  e.preventDefault();
  switch (state.value.name) {
    // TODO
    case 'new':
      console.log('submiting new...');
      break;
    case 'detail':
      console.log('submiting detail...');

      router.push(`/workshop/${activeWorkshop.value?.id}`);
      break;
    // TODO
    case 'editing':
      console.log('submiting editing...');
      state.value = WorkshopStates.Detail;
      break;
    default:
      throw Error('Unknown state');
  }
};
</script>
