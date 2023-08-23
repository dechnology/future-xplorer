<template>
  <form
    @submit.prevent="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <CardHeader
      :title="`議題${state.formTitle}`"
      :creator="'creator' in currentCase ? currentCase.creator : undefined"
      :user="user"
    />
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
    <div class="flex flex-col overflow-hidden rounded-lg">
      <NuxtImg v-if="imageUrlBuffer" :src="imageUrlBuffer" alt="" />
      <NuxtImg v-else-if="currentCase.image" :src="currentCase.image" alt="" />
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
const { currentCase, imageFileBuffer, imageUrlBuffer, activeId, state } =
  storeToRefs(cardStore);
const { issue } = storeToRefs(issueStore);
const { user, getTokenSilently } = await useAuth();

const disabled = computed(() => state.value.name === CardStates.Detail.name);

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

        const createdCase = await cardStore.submit(token, issue.value._id);

        if (!user.value) {
          throw new Error('user does not exist');
        }

        createdCase.creator = user.value;
        console.log('created case: ', createdCase);
        issueStore.upsertCase(createdCase);

        cardStore.setActiveCase(createdCase);
        cardStore.setCurrentCase(createdCase);
        state.value = CardStates.Detail;
        break;

      case CardStates.Detail.name:
        if (!activeId.value) {
          throw new Error('No active case to remove');
        }

        await cardStore.remove(token, activeId.value);
        issueStore.removeCase(activeId.value);
        state.value = CardStates.New;
        console.log('case removed');
        break;

      case CardStates.Editing.name:
        if (!activeId.value) {
          throw new Error('No active case to edit');
        }

        const editedCase = await cardStore.edit(token, activeId.value);
        editedCase.creator = user.value as User;
        console.log('edited case: ', editedCase);
        issueStore.upsertCase(editedCase);

        cardStore.setActiveCase(editedCase);
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
