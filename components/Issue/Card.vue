<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ state.formTitle }}</h3>
      <span v-if="'creatorId' in currentIssue" class="text-sm text-gray-500"
        >建立者：{{ currentIssue.creatorId }}</span
      >
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <InputText
        title="議題名稱"
        placeholder="議題名稱"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentIssue.title"
      />
      <InputTextarea
        title="議題描述"
        placeholder="議題描述"
        :disabled="state.name === CardStates.Detail.name"
        v-model="currentIssue.description"
      />
    </div>
    <div
      v-if="'createdAt' in currentIssue && 'updatedAt' in currentIssue"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentIssue.createdAt">
        建立時間：{{ format(currentIssue.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="currentIssue.updatedAt">
        建立時間：{{ format(currentIssue.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <IssueActionsNew v-if="state.name === CardStates.New.name" />
    <IssueActionsDetail v-if="state.name === CardStates.Detail.name" />
    <IssueActionsEditing v-if="state.name === CardStates.Editing.name" />
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
import { twMerge, ClassNameValue } from 'tailwind-merge';
import { CardStates } from '@/types/cardState';

const route = useRoute();
const router = useRouter();

const store = useIssueCardStore();
const modalStore = useModalStore();
const { currentIssue, state, activeIssue } = storeToRefs(store);

const handleSubmit = (e: Event) => {
  e.preventDefault();
  switch (state.value.name) {
    // TODO
    case 'new':
      console.log('submiting new...');
      console.log(currentIssue.value);

      break;
    case 'detail':
      console.log('submiting detail...');

      router.push(
        `${route.fullPath.replace(/\/+$/, '')}/issue/${activeIssue.value
          ?.id}/characters`
      );
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
