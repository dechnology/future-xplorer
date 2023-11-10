<template>
  <dialog
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-4 focus:outline-slate-300 xl:p-16"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <IllustrationStoriesModal v-if="modalState === 'stories'" />
    <IllustrationDetailsModal v-else />
  </dialog>
</template>

<script setup lang="ts">
interface Props {
  modalState: 'stories' | 'illustration';
}

defineProps<Props>();

const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
};
const { shown } = storeToRefs(stores.modal);

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
