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
        <span
          v-else-if="'creator' in currentCharacter && currentCharacter.creator"
        >
          {{ currentCharacter.creator.name }}
        </span>
        <span v-else>Unknown</span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-5 gap-y-7 rounded-lg">
      <InputText
        title="角色"
        placeholder="角色名稱"
        :disabled="disabled"
        :select-options="characterOptions.role"
        v-model="currentCharacter.role"
      />
      <InputText
        title="姓名"
        placeholder="姓名"
        :disabled="disabled"
        v-model="currentCharacter.name"
      />
      <InputText
        title="年齡"
        placeholder="年齡"
        :disabled="disabled"
        :select-options="characterOptions.age"
        v-model="currentCharacter.age"
      />
      <InputText
        title="性別"
        placeholder="性別"
        :disabled="disabled"
        :select-options="characterOptions.gender"
        v-model="currentCharacter.gender"
        select-only
      />
    </div>
    <InputTextarea
      title="特徵"
      placeholder="特徵"
      :disabled="disabled"
      :select-options="characterOptions.trait"
      v-model="currentCharacter.trait"
    />
    <InputTextarea
      title="其他"
      placeholder="其他"
      :disabled="disabled"
      v-model="currentCharacter.other"
    />
    <div
      v-if="currentCharacter.imageUrl"
      class="flex min-h-[296px] overflow-hidden rounded-lg"
    >
      <img
        class="w-full object-contain"
        :src="currentCharacter.imageUrl"
        alt=""
      />
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
      v-if="'createdAt' in currentCharacter && 'updatedAt' in currentCharacter"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentCharacter.createdAt">
        建立時間：{{ format(currentCharacter.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="currentCharacter.updatedAt">
        建立時間：{{ format(currentCharacter.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <CharacterActionsNew v-if="state.name === CardStates.New.name" />
    <CharacterActionsDetail v-if="state.name === CardStates.Detail.name" />
    <CharacterActionsEditing v-if="state.name === CardStates.Editing.name" />
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

const characterOptions = {
  role: ['教師', '學生', '媽媽', '爸爸'],
  gender: ['男', '女'],
  age: ['青少年', 'Z世代 (Gen Z)', '嬰兒'],
  trait: [
    '行為數位化',
    '資訊素養高',
    '環境意識高',
    '習慣科技運用',
    '需關注心理健康',
  ],
};

const store = useCharacterCardStore();
const modalStore = useModalStore();
const { currentCharacter, state } = storeToRefs(store);

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
