<template>
  <dialog
    ref="modal"
    class="h-2/3 w-1/4 rounded-2xl border-gray-300 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <ClientOnly>
      <div class="flex h-full w-full flex-col gap-5 overflow-y-auto p-10">
        <h3 class="text-justify text-4xl font-bold leading-loose text-black">
          新增分類
        </h3>
        <InputChips
          v-model:chips="categories.objects"
          title="Object - 物件 or 技術"
        />
        <InputChips
          v-model:chips="categories.environments"
          title="Environment - 環境 or 場景"
        />
        <InputChips
          v-model:chips="categories.messages"
          title="Message - 訊息 or 目標"
        />
        <InputChips
          v-model:chips="categories.services"
          title="Service - 服務、行動 or 經驗"
        />
      </div>
    </ClientOnly>
  </dialog>
</template>

<script setup lang="ts">
import cloneDeep from 'lodash/cloneDeep';
import { Keyword, Workshop, WorkshopElements } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
};
const { shown } = storeToRefs(stores.modal);
const { workshop } = storeToRefs(stores.issue);

const { ignoreNextClose } = storeToRefs(stores.modal);

const modal = ref<HTMLDialogElement | null>(null);
const categories = ref<{
  objects: string[];
  environments: string[];
  messages: string[];
  services: string[];
}>({
  objects: [],
  environments: [],
  messages: [],
  services: [],
});

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    if (workshop.value) {
      categories.value.objects = cloneDeep(workshop.value.objects);
      categories.value.environments = cloneDeep(workshop.value.environments);
      categories.value.messages = cloneDeep(workshop.value.messages);
      categories.value.services = cloneDeep(workshop.value.services);
    }
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
