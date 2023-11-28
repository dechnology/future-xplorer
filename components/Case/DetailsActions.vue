<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white transition-all"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="modalSignal = !modalSignal"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white transition-all"
      :class="!loading && 'hover:bg-opacity-50'"
      :disabled="loading"
      @click.prevent="() => (state = 'EDITING')"
    >
      編輯
    </CardButton>
    <CardButton
      class="rounded-lg bg-lime-600 text-white transition-all"
      :class="!loading && 'hover:bg-opacity-50'"
      :disabled="loading"
      @click.prevent="() => stores.modal.show()"
    >
      關鍵字
    </CardButton>
  </div>
  <ConfirmationModal
    :loading="loading"
    :signal="modalSignal"
    @confirm="handelConfirm"
  />
</template>

<script setup lang="ts">
import { Case } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};
const { activeId, state, loading } = storeToRefs(stores.case);

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
      throw new Error('No active case to remove');
    }

    let token = await getTokenSilently();
    const { message } = await fetchResource<Case>(
      token,
      `/api/cases/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    token = await getTokenSilently();
    stores.case.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
