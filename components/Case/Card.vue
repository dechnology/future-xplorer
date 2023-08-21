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
      v-model="currentCase.title"
    />
    <InputTextarea
      inputClasses="h-32"
      title="背景介紹"
      placeholder="案例背景"
      :disabled="disabled"
      v-model="currentCase.background"
    />
    <InputTextarea
      inputClasses="h-32"
      title="作法"
      placeholder="案例作法"
      :disabled="disabled"
      v-model="currentCase.method"
    />
    <InputTextarea
      inputClasses="h-32"
      title="目標"
      placeholder="案例目標"
      :disabled="disabled"
      v-model="currentCase.goal"
    />
    <InputTextarea
      inputClasses="h-32"
      title="問題與挑戰"
      placeholder="案例的問題與挑戰"
      :disabled="disabled"
      v-model="currentCase.challenge"
    />
    <InputTextarea
      inputClasses="h-32"
      title="成果"
      placeholder="成果"
      :disabled="disabled"
      v-model="currentCase.result"
    />
    <InputTextarea
      inputClasses="h-32"
      title="其他"
      placeholder="其他"
      :disabled="disabled"
      v-model="currentCase.other"
    />
    <InputText
      title="參考資料"
      placeholder="參考資料"
      :disabled="disabled"
      v-model="currentCase.reference"
    />
    <div class="flex min-h-[296px] overflow-hidden rounded-lg">
      <NuxtImg
        v-if="currentCase.image"
        class="w-full"
        :src="currentCase.image"
        alt=""
      />
      <IconCard
        v-else
        class="flex-1"
        :icon="{ name: 'material-symbols:add-photo-alternate', size: '5rem' }"
        :is-activated="false"
      />
    </div>
    <div
      v-if="'createdAt' in currentCase && 'updatedAt' in currentCase"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentCase.createdAt">
        建立時間：{{ formatDate(currentCase.createdAt) }}
      </div>
      <div v-if="currentCase.updatedAt">
        建立時間：{{ formatDate(currentCase.updatedAt) }}
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
import { CardStates } from '@/types';
import type { User } from '@/types';

const cardStore = useCaseCardStore();
const issueStore = useIssueStore();
const modalStore = useModalStore();
const { currentCase, activeId, state } = storeToRefs(cardStore);
const { workshop, issue } = storeToRefs(issueStore);
const { user, getTokenSilently } = await useAuth();

const disabled = computed(() => state.value.name === CardStates.Detail.name);

const handleSubmit = async (e: Event) => {
  try {
    const token = await getTokenSilently();

    switch (state.value.name) {
      case CardStates.New.name:
        if (!issue.value) {
          throw new Error('no issue to bind persona');
        }

        const createdCase = await cardStore.submit(token, issue.value._id);

        createdCase.creator = user.value as User;
        console.log('created persona: ', createdCase);
        issueStore.upsertCase(createdCase);

        cardStore.setActiveId(createdCase._id);
        cardStore.setCurrentCase(createdCase);
        state.value = CardStates.Detail;
        break;

      case CardStates.Detail.name:
        if (!activeId.value) {
          throw new Error('No active persona to remove');
        }

        await cardStore.remove(token, activeId.value);
        issueStore.removeCase(activeId.value);
        state.value = CardStates.New;
        console.log('persona removed');
        break;

      case CardStates.Editing.name:
        if (!activeId.value) {
          throw new Error('No active persona to edit');
        }

        const editedCase = await cardStore.edit(token, activeId.value);
        editedCase.creator = user.value as User;
        console.log('edited persona: ', editedCase);
        issueStore.upsertCase(editedCase);

        cardStore.setActiveId(editedCase._id);
        cardStore.setCurrentCase(editedCase);
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
