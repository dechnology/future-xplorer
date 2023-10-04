<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      @click.prevent="handleRemove"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
      @click.prevent="handleStart"
    >
      開始
    </CardButton>
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      @click.prevent="handleEdit"
    >
      編輯
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { Workshop } from '@/types';

const { getTokenSilently } = useAuth();
const router = useRouter();
const stores = { workshops: useWorkshopsStore() };
const { activeId, state, loading } = storeToRefs(stores.workshops);

const handleRemove = async () => {
  try {
    if (!activeId.value) {
      throw new Error('No active workshop to remove');
    }

    loading.value = true;
    let token = await getTokenSilently();
    const data = await fetchResource<Workshop>(
      token,
      `/api/workshops/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(data);

    token = await getTokenSilently();
    await stores.workshops.update(token);
    state.value = 'NEW';
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  loading.value = false;
};

const handleStart = () => {
  router.push(`/workshop/${activeId.value}`);
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
