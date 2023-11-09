<template>
  <dialog
    v-if="activePersona"
    ref="modal"
    class="h-5/6 w-5/6 rounded-2xl border-gray-300 p-4 focus:outline-slate-300 xl:p-16"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-full flex-col gap-4 overflow-y-auto xl:gap-8">
      <div class="flex basis-11/12">
        <div class="flex h-full basis-1/2">
          <PersonaModalAvatar :current-persona-image="activePersona.image" />
        </div>
        <div class="h-full basis-1/2">
          <PersonaModalContent v-slot="slotProps">
            <div
              v-for="(content, title) in slotProps.content"
              :key="`${content}_${title}`"
            >
              <p
                class="font-['Roboto'] text-2xl font-bold leading-10 text-neutral-600"
              >
                <span class="font-semibold">{{ title }}：</span>
                <span>{{ content }}</span>
              </p>
            </div>
          </PersonaModalContent>
        </div>
      </div>
      <div
        class="relative flex basis-1/12 flex-col items-center justify-center"
      >
        <PersonaModalActions />
        <PersonaModalFootnote>
          <p>
            <span class="font-regular text-gray-400">
              <br />{{ `建立者：${activePersona.creator.name}` }} <br />{{
                `新增時間：${format(activePersona.createdAt, 'yyyy-MM-dd')}`
              }}
              <br />{{
                `更新時間：${format(activePersona.updatedAt, 'yyyy-MM-dd')}`
              }}
            </span>
          </p>
        </PersonaModalFootnote>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

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
