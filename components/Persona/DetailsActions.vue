<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleRemove"
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      body="刪除"
    />
    <CardButton
      @click.prevent="handleEdit"
      class="rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { Persona } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { activeId, state, loading } = storeToRefs(stores.persona);

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active persona to remove');
    }

    const token = await getTokenSilently();
    const { message } = await fetchResource<Persona>(
      token,
      `/api/personas/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    stores.issue.removePersona(activeId.value);
    stores.persona.changeActivePersona();
    console.log('persona removed');
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
