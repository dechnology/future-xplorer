<template>
  <dialog
    ref="modal"
    class="max-h-2/3 max-w-1/3 rounded-2xl border-gray-300 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <ClientOnly>
      <div class="flex h-full w-full flex-col gap-5 overflow-y-auto p-9">
        <h3 class="text-justify text-4xl font-bold leading-loose text-black">
          新增分類
        </h3>
        <InputChips
          v-model:chips="categories.objects"
          li-classes="text-white bg-black"
          title="Object - 物件 or 技術"
          required-chip="技術"
        />
        <InputChips
          v-model:chips="categories.environments"
          li-classes="text-white bg-black"
          title="Environment - 環境 or 場景"
          required-chip="場景體驗"
        />
        <InputChips
          v-model:chips="categories.messages"
          li-classes="text-white bg-black"
          title="Message - 訊息 or 目標"
          required-chip="洞見與價值"
        />
        <InputChips
          v-model:chips="categories.services"
          li-classes="text-white bg-black"
          title="Service - 服務、行動 or 經驗"
          required-chip="使用者體驗"
        />
        <div class="flex items-center justify-around">
          <CardButton
            class="rounded-lg bg-red-400 text-white"
            :class="!loading && 'hover:bg-red-500'"
            :disabled="loading"
            @click.prevent="() => stores.modal.close()"
          >
            取消
          </CardButton>
          <CardButton
            class="rounded-lg bg-indigo-500 text-white"
            :class="!loading && 'hover:bg-indigo-600'"
            :disabled="loading"
            @click.prevent="handleSave"
          >
            儲存
          </CardButton>
        </div>
      </div>
    </ClientOnly>
  </dialog>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import type { Workshop, WorkshopElements } from '~/types';
import { WorkshopElementsSchema } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
};
const { shown } = storeToRefs(stores.modal);
const { workshopId, elements, loading } = storeToRefs(stores.issue);

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

  if (newShown && elements.value) {
    categories.value = cloneDeep(elements.value);
    modal.value?.showModal();
    return;
  }

  modal.value?.close();
});

const handleSave = async () => {
  try {
    ignoreNextClose.value = true;
    loading.value = true;

    if (!workshopId.value) {
      throw new Error('No workshop id');
    }

    let token = await getTokenSilently();
    const els: WorkshopElements = WorkshopElementsSchema.parse(
      categories.value
    );

    if (isEqual(els, elements.value)) {
      throw new Error('No Change');
    }

    console.log('Patching: ', els);
    const { data: editedWorkshop } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${workshopId.value}`,
      { method: 'put', body: els }
    );
    console.log('Patched: ', editedWorkshop);

    token = await getTokenSilently();
    await stores.issue.updateWorkshop(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
    ignoreNextClose.value = false;
    stores.modal.close();
  }
};
</script>
