<template>
  <dialog
    v-if="activePersona"
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-16 pb-0 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-11/12">
      <div class="flex h-full basis-1/2 flex-col gap-7">
        <slot />
      </div>
      <div class="h-full basis-1/2 p-16">
        <slot name="personaInfo" />
      </div>
    </div>
    <div class="flex h-1/12 flex-col items-center justify-center">
      <slot name="actions" />
    </div>
  </dialog>
</template>

<script setup lang="ts">
const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  persona: usePersonaStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activePersona } = storeToRefs(stores.persona);

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
