<template>
  <form
    @submit="handleSubmit"
    class="relative flex flex-col gap-10 rounded-md bg-white p-8 shadow-2xl"
  >
    <div class="flex items-end gap-4">
      <h3 class="text-2xl font-medium text-blue-950">{{ state.formTitle }}</h3>
      <span class="text-sm text-gray-500"
        >建立者：{{ currentIssue.creator }}</span
      >
    </div>
    <div class="flex flex-col gap-7 rounded-lg">
      <div class="flex flex-col gap-4">
        <label
          for="title"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          議題名稱
        </label>
        <input
          type="text"
          id="title"
          placeholder="議題名稱"
          v-model="currentIssue.title"
          class="h-16"
          :disabled="state.name == IssueStates.Detail.name"
          :class="commonInputClasses"
        />
      </div>
      <div class="flex flex-col gap-4">
        <label
          for="desc"
          class="bg-white px-1 text-lg font-semibold text-gray-700"
        >
          議題描述
        </label>
        <textarea
          id="desc"
          placeholder="議題描述"
          v-model="currentIssue.description"
          class="h-80 resize-none text-start"
          :disabled="state.name == IssueStates.Detail.name"
          :class="commonInputClasses"
        ></textarea>
      </div>
    </div>
    <div
      v-if="currentIssue.createdAt || currentIssue.updatedAt"
      class="flex items-center justify-center gap-2"
    >
      <div v-if="currentIssue.createdAt">
        建立時間：{{ format(currentIssue.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div v-if="currentIssue.updatedAt">
        建立時間：{{ format(currentIssue.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <IssueActionsNew v-if="state.name === IssueStates.New.name" />
    <IssueActionsDetail v-if="state.name === IssueStates.Detail.name" />
    <IssueActionsEditing v-if="state.name === IssueStates.Editing.name" />
    <Icon
      v-if="state.name === IssueStates.Detail.name"
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
import { IssueStates } from '@/types/issue';

const route = useRoute();
const router = useRouter();

const modalStore = useModalStore();
const workshopStore = useWorkshopStore();
const { currentIssue, state, activeIssue } = storeToRefs(workshopStore);

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
  if (state.value.name === IssueStates.Detail.name) {
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

      router.push(`${route.fullPath}/issue/${activeIssue.value?.id}/people`);
      break;
    // TODO
    case 'editing':
      console.log('submiting editing...');
      state.value = IssueStates.Detail;
      break;
    default:
      throw Error('Unknown state');
  }
};
</script>
