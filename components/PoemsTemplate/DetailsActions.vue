<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white transition-all hover:bg-red-500"
      @click.prevent="modalSignal = !modalSignal"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 text-white transition-all hover:bg-opacity-50"
      @click.prevent="handleEdit"
    >
      編輯
    </CardButton>
  </div>
  <ConfirmationModal
    :loading="loading"
    :signal="modalSignal"
    @confirm="handelConfirm"
  />
</template>

<script setup lang="ts">
import { PoemsTemplate } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  poemsTemplate: usePoemsTemplateStore(),
};
const { activeId, state, loading } = storeToRefs(stores.poemsTemplate);

const modalSignal = ref(false);

const handelConfirm = async (status: boolean) => {
  if (status) {
    await handleRemove();
  }
  modalSignal.value = !modalSignal.value;
};

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active poemsTemplate to remove');
    }

    let token = await getTokenSilently();
    const { message } = await fetchResource<PoemsTemplate>(
      token,
      `/api/poemsTemplates/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    token = await getTokenSilently();
    await stores.poemsTemplate.update(token);
    console.log('poemsTemplate removed');
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
