<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 text-white transition-all"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="handleRemove"
    >
      <span class="py-3"> 刪除 </span>
    </CardButton>
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 px-8 text-white transition-all"
      :class="!loading && 'hover:bg-opacity-50'"
      :disabled="loading"
      @click.prevent="handleEdit"
    >
      <span class="py-3"> 編輯 </span>
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { Persona } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  persona: usePersonaStore(),
};
const { activeId, state, loading } = storeToRefs(stores.persona);

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active persona to remove');
    }

    let token = await getTokenSilently();
    const { message } = await fetchResource<Persona>(
      token,
      `/api/personas/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    token = await getTokenSilently();
    await stores.persona.update(token);
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
