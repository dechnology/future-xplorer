<template>
  <form
    @submit.prevent="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <CardHeader
      :title="`人物${state.formTitle}`"
      :creator="
        'creator' in currentPersona ? currentPersona.creator : undefined
      "
      :user="user"
    />
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
      input-classes="h-32"
      :disabled="disabled"
      :select-options="[...personaPresets.trait]"
      v-model="currentPersona.trait"
    />
    <InputTextarea
      title="其他"
      placeholder="其他"
      input-classes="h-32"
      :disabled="disabled"
      v-model="currentPersona.other"
    />
    <div class="flex flex-col overflow-hidden rounded-lg">
      <NuxtImg v-if="imageUrlBuffer" :src="imageUrlBuffer" alt="" />
      <InputFileDropzone
        v-else
        @blob-url-created="handleBlobUrlChange"
        class="h-72 shrink-0 grow"
        v-model:file="imageFileBuffer"
        :disabled="disabled"
        :active-icon="{
          name: 'material-symbols:add-photo-alternate',
          size: '5rem',
        }"
        :disabled-icon="{ name: 'mdi:image', size: '5rem' }"
      />
    </div>
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
        建立時間：{{ formatDate(currentPersona.createdAt) }}
      </div>
      <div v-if="currentPersona.updatedAt">
        建立時間：{{ formatDate(currentPersona.updatedAt) }}
      </div>
    </div>
    <PersonaActionsNew v-if="state.name === CardStates.New.name" />
    <PersonaActionsDetail v-if="state.name === CardStates.Detail.name" />
    <PersonaActionsEditing v-if="state.name === CardStates.Editing.name" />
    <!-- TODO -->
    <!-- <Icon
      v-if="state.name === CardStates.Detail.name"
      @click="() => modalStore.show()"
      class="absolute right-6 top-6 cursor-pointer text-blue-950"
      name="material-symbols:pan-zoom-rounded"
      size="3rem"
    /> -->
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
import { storeToRefs } from 'pinia';
import { personaPresets, CardStates } from '@/types';
import type { User } from '@/types';

const cardStore = usePersonaCardStore();
const issueStore = useIssueStore();
const modalStore = useModalStore();
const { currentPersona, imageUrlBuffer, imageFileBuffer, activeId, state } =
  storeToRefs(cardStore);
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

const handleBlobUrlChange = (url: string) => {
  cardStore.setImageUrl(url);
};

const handleSubmit = async (e: Event) => {
  try {
    const token = await getTokenSilently();

    switch (state.value.name) {
      case CardStates.New.name:
        if (!issue.value) {
          throw new Error('no issue to bind persona');
        }

        const createdPersona = await cardStore.submit(token, issue.value._id);

        createdPersona.creator = user.value as User;
        console.log('created persona: ', createdPersona);
        issueStore.upsertPersona(createdPersona);

        cardStore.setActivePersona(createdPersona);
        cardStore.setCurrentPersona(createdPersona);
        state.value = CardStates.Detail;
        break;

      case CardStates.Detail.name:
        if (!activeId.value) {
          throw new Error('No active persona to remove');
        }

        await cardStore.remove(token, activeId.value);
        issueStore.removePersona(activeId.value);
        state.value = CardStates.New;
        console.log('persona removed');
        break;

      case CardStates.Editing.name:
        if (!activeId.value) {
          throw new Error('No active persona to edit');
        }

        const editedPersona = await cardStore.edit(token, activeId.value);
        editedPersona.creator = user.value as User;
        console.log('edited persona: ', editedPersona);
        issueStore.upsertPersona(editedPersona);

        cardStore.setActivePersona(editedPersona);
        cardStore.setCurrentPersona(editedPersona);
        state.value = CardStates.Detail;
        break;

      default:
        throw new Error(`Unknown state: ${state.value.name}`);
    }
  } catch (e) {
    console.error(e);
  }
};
</script>
