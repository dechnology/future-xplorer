<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click="handleClear"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="清除"
    />
    <CardButton
      @click="handleCreate"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="新增"
    />
  </div>
</template>

<script setup lang="ts">
import { NewWorkshopSchema, User, Workshop } from '@/types';

const { user, getTokenSilently } = await useAuth();
const store = useWorkshopsStore();
const { currentWorkshop, loading } = storeToRefs(store);

const handleClear = () => {
  store.clearCurrentWorkshop();
};

const handleCreate = async () => {
  try {
    loading.value = true;
    const token = await getTokenSilently();
    const w = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Creating: ', w);
    const { data: createdWorkshop } = await fetchResource<Workshop>(
      token,
      `/api/workshops`,
      {
        method: 'post',
        body: w,
      }
    );
    createdWorkshop.creator = user.value as User;

    console.log('Created: ', createdWorkshop);
    store.upsert(createdWorkshop);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
