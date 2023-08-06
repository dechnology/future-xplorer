<template>
  <dialog
    @click="handleBackdropClick"
    ref="modal"
    class="w-2/3 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
  >
    <div class="relative flex flex-col gap-12">
      <h3 v-if="content.title" class="text-4xl font-bold">
        {{ content.title }}
      </h3>
      <p v-if="content.description" class="text-2xl">
        {{ content.description }}
      </p>
      <div
        v-if="content.footnotes"
        class="absolute bottom-0 right-0 mt-auto flex flex-col items-end text-xs text-gray-300"
      >
        <div v-for="line in content.footnotes">{{ line }}</div>
      </div>
      <CardButton
        @click="handleCloseClick"
        class="m-auto h-12 w-28 rounded-lg bg-red-400 text-white hover:bg-red-500 active:bg-red-600"
        :icon="{ name: 'mdi:close', size: '3rem' }"
        body="關閉"
      />
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const modal = ref<HTMLDialogElement | null>(null);
const modalStore = useModalStore();
const { shown, content } = storeToRefs(modalStore);

const handleBackdropClick = (e: MouseEvent) => {
  const { x, y } = e;
  const { left, right, top, bottom } = (
    e.target as HTMLDialogElement
  ).getBoundingClientRect();

  if (x < left || x > right || y < top || y > bottom) {
    modalStore.close();
  }
};

const handleCloseClick = (e: Event) => modalStore.close();

watch(shown, (newShown) => {
  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>

<style scoped></style>
