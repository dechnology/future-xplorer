<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      body="刪除"
      @click.prevent="handleRemove"
    />
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="編輯"
      @click.prevent="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { PoemsTemplate } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  poemsTemplate: usePoemsTemplateStore(),
};
const { activeId, state, loading } = storeToRefs(stores.poemsTemplate);

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active poemsTemplate to remove');
    }

    const token = await getTokenSilently();
    const { message } = await fetchResource<PoemsTemplate>(
      token,
      `/api/poemsTemplates/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    stores.poemsTemplate.removePoemsTemplate(activeId.value);
    stores.poemsTemplate.changeActivePoemsTemplate();
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
