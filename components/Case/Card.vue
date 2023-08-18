<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ state.formTitle }}</h3>
      <div class="text-sm text-gray-500">
        <span>建立者：</span>
        <span v-if="state.name === CardStates.New.name"> You </span>
        <span v-else-if="'creator' in currentCase && currentCase.creator">
          {{ currentCase.creator.name }}
        </span>
        <span v-else>Unknown</span>
      </div>
    </div>
    <InputText
      title="標題"
      placeholder="案例標題"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="背景介紹"
      placeholder="案例背景"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="作法"
      placeholder="案例作法"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="目標"
      placeholder="案例目標"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="問題與挑戰"
      placeholder="案例的問題與挑戰"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="成果"
      placeholder="成果"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputTextarea
      inputClasses="h-28"
      title="其他"
      placeholder="其他"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputText
      title="參考資料"
      placeholder="參考資料"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <div
      v-if="currentCase.image"
      class="flex min-h-[296px] overflow-hidden rounded-lg"
    >
      <img class="w-full object-contain" :src="currentCase.image" alt="" />
    </div>
    <Card
      v-else
      class="min-h-[296px] bg-slate-400"
      :icon="{ name: 'material-symbols:add-photo-alternate', size: '5rem' }"
    />
    <CardButton
      v-if="state.name !== CardStates.Detail.name"
      @click="() => {}"
      class="h-12 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:play', size: '3rem' }"
      body="AI生成圖片"
    />
    <div
      v-if="'createdAt' in currentCase && 'updatedAt' in currentCase"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentCase.createdAt">
        建立時間：{{ format(currentCase.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="currentCase.updatedAt">
        建立時間：{{ format(currentCase.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <CaseActionsNew v-if="state.name === CardStates.New.name" />
    <CaseActionsDetail v-if="state.name === CardStates.Detail.name" />
    <CaseActionsEditing v-if="state.name === CardStates.Editing.name" />
    <Icon
      v-if="state.name === CardStates.Detail.name"
      @click="() => modalStore.show()"
      class="absolute right-6 top-6 cursor-pointer text-blue-950"
      name="material-symbols:pan-zoom-rounded"
      size="3rem"
    />
  </form>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { CardStates } from '@/types/cardState';

const store = useCaseCardStore();
const modalStore = useModalStore();
const { currentCase, state, activeId } = storeToRefs(store);

const disabled = computed(() => state.value.name === CardStates.Detail.name);

const handleSubmit = (e: Event) => {
  e.preventDefault();
  switch (state.value.name) {
    // TODO
    case 'new':
      console.log('submiting new...');
      break;
    case 'detail':
      console.log('submiting detail...');
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
