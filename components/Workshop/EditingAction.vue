<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click="handleCancel"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="取消"
    />
    <CardButton
      @click="handleSaveEdit"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="儲存"
    />
  </div>
</template>

<script setup lang="ts">
import { NewWorkshopSchema, User, Workshop } from '@/types';

const { user, getTokenSilently } = await useAuth();
const store = useWorkshopsStore();
const { currentWorkshop, activeId, activeWorkshop, loading } =
  storeToRefs(store);

const handleCancel = () => {
  store.changeActiveWorkshop(activeWorkshop.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;
    const token = await getTokenSilently();
    const w = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Patching: ', w);
    const { data: editedWorkshop } = await fetchResource<Workshop>(
      token,
      `/api/workshops/${activeId.value}`,
      { method: 'put', body: w }
    );

    editedWorkshop.creator = user.value as User;
    console.log('Patched: ', editedWorkshop);
    store.upsert(editedWorkshop);
    store.changeActiveWorkshop(editedWorkshop);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
