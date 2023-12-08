<template>
  <div class="flex items-center justify-around">
    <div class="flex basis-1/3 items-center justify-center">
      <Icon
        name="mdi-delete"
        class="h-6 w-6 cursor-pointer text-red-400 transition-all hover:text-red-500 xl:h-8 xl:w-8"
        @click.prevent="modalSignal = !modalSignal"
      />
    </div>
    <div class="flex basis-1/3 items-center justify-center">
      <CardButton
        class="rounded-lg bg-black bg-opacity-40 text-white transition-all"
        :class="!loading && 'hover:bg-opacity-50'"
        :disabled="loading"
        @click.prevent="handleEdit"
      >
        編輯
      </CardButton>
    </div>
    <div class="basis-1/3"></div>
  </div>
  <ConfirmationModal
    :loading="loading"
    :signal="modalSignal"
    @confirm="handelConfirm"
  />
</template>

<script setup lang="ts">
import { Persona } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  persona: usePersonaStore(),
};
const { activePersona, activeId, state, loading } = storeToRefs(stores.persona);

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
    activePersona.value = null;
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
