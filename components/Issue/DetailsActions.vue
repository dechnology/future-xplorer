<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleRemove"
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      body="刪除"
    />
    <CardButton
      @click.prevent="handleStart"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
      body="開始"
    />
    <CardButton
      @click.prevent="handleEdit"
      class="rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="編輯"
    />
  </div>
</template>

<script setup lang="ts">
import { Issue } from '@/types';

const { getTokenSilently } = await useAuth();
const router = useRouter();
const store = useWorkshopStore();
const { workshopId, activeId, state, loading } = storeToRefs(store);

const handleRemove = async () => {
  try {
    if (!activeId.value) {
      throw new Error('No active issue to remove');
    }

    loading.value = true;
    const token = await getTokenSilently();
    const { message } = await fetchResource<Issue>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    store.remove(activeId.value);
    state.value = 'NEW';
    console.log('issue removed');
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  loading.value = false;
};

const handleStart = () => {
  if (!workshopId) {
    console.error('workshop id undefined');
  }
  router.push(`/workshop/${workshopId.value}/issue/${activeId.value}`);
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
