<template>
  <dialog
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-8 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <CaseDetailsModal v-if="activeCase" />
    <CaseHistoryModal v-else />
  </dialog>
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activeCase } = storeToRefs(stores.case);

const modal = ref<HTMLDialogElement | null>(null);

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
