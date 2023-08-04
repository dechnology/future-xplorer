<template>
  <dialog
    @close="() => (modalShown = false)"
    v-if="activeIssue"
    ref="modal"
    class="w-2/3 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
  >
    <div class="relative flex flex-col gap-12">
      <h3 class="text-4xl font-bold">{{ activeIssue.title }}</h3>
      <p class="text-2xl">{{ activeIssue.description }}</p>
      <div
        class="absolute bottom-0 right-0 mt-auto flex flex-col items-end text-xs text-gray-300"
      >
        <div>建立者：{{ activeIssue.creator }}</div>
        <div v-if="activeIssue.createdAt">
          新增時間：{{ format(activeIssue.createdAt, 'yyyy-MM-dd') }}
        </div>
        <div v-if="activeIssue.updatedAt">
          更新時間：{{ format(activeIssue.updatedAt, 'yyyy-MM-dd') }}
        </div>
      </div>
      <CardButton
        @click="handleModalCloseClick"
        class="m-auto h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500 active:bg-red-600"
        :icon="{ name: 'mdi:close', size: '3rem' }"
        body="關閉"
      />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { storeToRefs } from 'pinia';

const issueStore = useIssueStore();
const { activeIssue, modalShown } = storeToRefs(issueStore);

const modal = ref<HTMLDialogElement | null>(null);

watch(modalShown, (newShown, prevShown) => {
  if (newShown) {
    modal.value?.showModal();
  }
});

const handleModalCloseClick = (e: Event) => {
  modal.value?.close();
};
</script>

<style scoped></style>
