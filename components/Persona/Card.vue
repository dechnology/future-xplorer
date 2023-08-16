<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">
        角色{{ state.formTitle }}
      </h3>
      <div class="text-sm text-gray-500">
        <span>建立者：</span>
        <span v-if="'creator' in currentPersona">
          {{ currentPersona.creator.name }}
        </span>
        <span v-else-if="state.name === CardStates.New.name && user">
          {{ user.name }}
        </span>
        <span v-else> Unknown </span>
      </div>
    </div>
    <div class="grid grid-cols-2 gap-x-5 gap-y-7 rounded-lg">
      <InputText
        title="角色"
        placeholder="角色名稱"
        :disabled="disabled"
        :select-options="[...personaPresets.role]"
        v-model="currentPersona.role"
      />
      <InputText
        title="姓名"
        placeholder="姓名"
        :disabled="disabled"
        v-model="currentPersona.name"
      />
      <InputText
        title="年齡"
        placeholder="年齡"
        :disabled="disabled"
        :select-options="[...personaPresets.age]"
        v-model="currentPersona.age"
      />
      <InputText
        title="性別"
        placeholder="性別"
        :disabled="disabled"
        :select-options="[...personaPresets.gender]"
        v-model="currentPersona.gender"
        select-only
      />
    </div>
    <InputTextarea
      title="特徵"
      placeholder="特徵"
      :disabled="disabled"
      :select-options="[...personaPresets.trait]"
      v-model="currentPersona.trait"
    />
    <InputTextarea
      title="其他"
      placeholder="其他"
      :disabled="disabled"
      v-model="currentPersona.other"
    />
    <div
      v-if="currentPersona.image"
      class="flex min-h-[296px] overflow-hidden rounded-lg"
    >
      <img class="w-full object-contain" :src="currentPersona.image" alt="" />
    </div>
    <Card
      v-else
      class="min-h-[296px] bg-slate-400"
      :icon="{ name: 'material-symbols:add-photo-alternate', size: '5rem' }"
    />
    <CardButton
      v-if="state.name !== CardStates.Detail.name"
      @click.prevent="handlePortraitGeneration"
      class="h-12 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi:play', size: '3rem' }"
      body="AI生成圖片"
    />
    <div
      v-if="'createdAt' in currentPersona && 'updatedAt' in currentPersona"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentPersona.createdAt">
        建立時間：{{ format(currentPersona.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="currentPersona.updatedAt">
        建立時間：{{ format(currentPersona.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <PersonaActionsNew v-if="state.name === CardStates.New.name" />
    <PersonaActionsDetail v-if="state.name === CardStates.Detail.name" />
    <PersonaActionsEditing v-if="state.name === CardStates.Editing.name" />
    <Icon
      v-if="state.name === CardStates.Detail.name"
      @click="() => modalStore.show()"
      class="absolute right-6 top-6 cursor-pointer text-blue-950"
      name="material-symbols:pan-zoom-rounded"
      size="3rem"
    />
    <Icon
      v-if="state.name === CardStates.New.name"
      @click="handleDiceClick"
      class="absolute right-6 top-6 cursor-pointer text-blue-950"
      name="game-icons:rolling-dices"
      size="3rem"
    />
  </form>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';
import { personaPresets } from '@/types/persona';
import { CardStates } from '@/types/cardState';

const cardStore = usePersonaCardStore();
const issueStore = useIssueStore();
const modalStore = useModalStore();
const { currentPersona, state } = storeToRefs(cardStore);
const { workshop, issue } = storeToRefs(issueStore);
const { user, getTokenSilently } = await useAuth();

const disabled = computed(() => state.value.name === CardStates.Detail.name);

const handleDiceClick = () => {
  cardStore.randomizeCurrentPersona();
};

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const token = await getTokenSilently();
    await cardStore.generatePortrait(token, {
      workshop: workshop.value,
      issue: issue.value,
    });
  } catch (e) {
    console.error(e);
  }
};

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
