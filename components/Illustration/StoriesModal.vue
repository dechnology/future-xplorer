<template>
  <dialog
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-full flex-col">
      <div class="min-h-0 shrink grow flex-col gap-7">
        <slot />
      </div>
      <div>
        <slot name="actions" />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  story: useStoryStore(),
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
