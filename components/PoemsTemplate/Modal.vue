<template>
  <dialog
    v-if="activePoemsTemplate"
    ref="modal"
    class="rounded-2xl border-gray-300 p-4 focus:outline-slate-300 xl:p-16"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-full flex-col gap-4 xl:gap-8">
      <h3 class="text-xl font-bold xl:text-2xl">
        {{ activePoemsTemplate.title }}
      </h3>
      <p class="whitespace-pre-wrap">
        {{
          [
            `P: ${
              activePoemsTemplate.persona &&
              `${activePoemsTemplate.persona.trait}的${activePoemsTemplate.persona.role}`
            }`,
            `O: ${activePoemsTemplate.object}`,
            `E: ${activePoemsTemplate.environment}`,
            `M: ${activePoemsTemplate.message}`,
            `S: ${activePoemsTemplate.service}`,
          ].join('\n\n')
        }}
      </p>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activePoemsTemplate } = storeToRefs(stores.poemsTemplate);

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
