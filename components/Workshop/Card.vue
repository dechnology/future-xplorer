<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ state.formTitle }}</h3>
      <!-- <span v-if="currentWorkshop.creatorId" class="text-sm text-gray-500"
        >建立者：{{ currentWorkshop.creatorId }}</span
      > -->
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <InputText
        title="工作坊名稱"
        placeholder="工作坊名稱"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentWorkshop.name"
      />
      <InputText
        title="工作坊描述"
        placeholder="工作坊描述"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentWorkshop.description"
      />
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
      <div
        v-for="(value, key) in workshopElementGroup"
        class="flex flex-col gap-4"
      >
        <label
          for="duration"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          {{ key }} - {{ value.description }}
        </label>
        <div>
          <span v-for="el in value.elements">{{ el }}</span>
        </div>
        <!-- <ChipInput :chips="value.elements as Chip[]" /> -->
      </div>
    </div>
    <div
      v-if="'createdAt' in currentWorkshop && 'updatedAt' in currentWorkshop"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="'createdAt' in currentWorkshop">
        建立時間：{{ formatDate(currentWorkshop.createdAt) }}
      </div>
      <div v-if="'updatedAt' in currentWorkshop">
        建立時間：{{ formatDate(currentWorkshop.updatedAt) }}
      </div>
    </div>
    <WorkshopActionsNew v-if="state.name === CardStates.New.name" />
    <WorkshopActionsDetail v-if="state.name === CardStates.Detail.name" />
    <WorkshopActionsEditing v-if="state.name === CardStates.Editing.name" />
  </form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { WorkshopElement } from '@/types/workshop';
import { CardStates } from '@/types/cardState';
import { ClassNameValue, twMerge } from 'tailwind-merge';

interface DateValue {
  start: Date;
  end: Date;
}

const router = useRouter();
const store = useWorkshopCardStore();
const { activeWorkshop, currentWorkshop, state } = storeToRefs(store);

type WorkshopElementGroup = {
  [key in WorkshopElement['category']]: {
    description: string;
    elements: string[];
  };
};

const workshopElementGroup = computed(() => {
  const result: WorkshopElementGroup = {
    object: { description: '物件 or 技術', elements: [] },
    environment: { description: '環境 or 場景', elements: [] },
    message: { description: '訊息 or 目標', elements: [] },
    service: { description: '服務、行動 or 經驗', elements: [] },
  };

  for (const el of currentWorkshop.value.elements) {
    switch (el.category) {
      case 'object':
        result.object.elements.push(el.name);
        break;
      case 'environment':
        result.environment.elements.push(el.name);
        break;
      case 'message':
        result.message.elements.push(el.name);
        break;
      case 'service':
        result.service.elements.push(el.name);
        break;
    }
  }

  return result;
});

const now = new Date();
const dateValue = ref<DateValue>({
  start: now,
  end: now,
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
      state.value = CardStates.Detail;
      break;
    default:
      throw Error('Unknown state');
  }
};
</script>
