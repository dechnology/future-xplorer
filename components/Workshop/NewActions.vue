<template>
  <div class="flex items-center justify-around">
    <!-- <CardButton
      class="rounded-lg bg-red-400 text-white"
      :class="!loading && 'transition-all hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="handleClear"
    >
      清除
    </CardButton> -->
    <CardButton
      class="rounded-lg bg-indigo-500 text-white"
      :class="!loading && 'transition-all hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { NewWorkshopSchema, Workshop } from '@/types';

const { getTokenSilently } = useAuth();
const stores = { workshops: useWorkshopsStore() };
const { currentWorkshop, loading } = storeToRefs(stores.workshops);

// const handleClear = () => {
//   stores.workshops.resetForm();
// };

const handleCreate = async () => {
  try {
    loading.value = true;
    let token = await getTokenSilently();

    currentWorkshop.value = {
      ...getDefaultWorkshop(),
      ...Object.fromEntries(
        Object.entries(currentWorkshop.value).filter(([k, v]) => v)
      ),
    };

    const el = NewWorkshopSchema.parse(currentWorkshop.value);

    console.log('Creating: ', el);
    const { data: createdWorkshop } = await fetchResource<Workshop>(
      token,
      `/api/workshops`,
      {
        method: 'post',
        body: el,
      }
    );
    console.log('Created: ', createdWorkshop);

    token = await getTokenSilently();
    await stores.workshops.update(token);
    stores.workshops.resetForm();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
