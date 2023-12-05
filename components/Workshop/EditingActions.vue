<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white"
      :class="!loading && 'transition-all hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white"
      :class="!loading && 'transition-all hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import { NewWorkshopSchema, Workshop } from '@/types';

const { getTokenSilently } = useAuth();
const stores = { workshops: useWorkshopsStore() };
const { currentWorkshop, activeId, activeWorkshop, state, loading } =
  storeToRefs(stores.workshops);

const handleCancel = () => {
  stores.workshops.resetForm();
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentWorkshop.value, activeWorkshop.value)) {
      state.value = 'DETAILS';
      return;
    }

    let token = await getTokenSilently();
    const parsedEditedWorkshop = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Patching: ', parsedEditedWorkshop);
    const { data: editedWorkshop } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${activeId.value}`,
      { method: 'put', body: parsedEditedWorkshop }
    );

    console.log('Patched: ', editedWorkshop);

    token = await getTokenSilently();
    await stores.workshops.update(token);
    state.value = 'DETAILS';
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
