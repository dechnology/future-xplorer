<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white transition-all hover:bg-red-500"
      @click.prevent="handleRemove"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white transition-all hover:bg-indigo-600"
      @click.prevent="handleStart"
    >
      開始
    </CardButton>
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 text-white transition-all hover:bg-opacity-50"
      @click.prevent="handleEdit"
    >
      編輯
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { Issue } from '@/types';

const { getTokenSilently } = useAuth();
const router = useRouter();
const stores = { workshop: useWorkshopStore() };
const { workshopId, activeId, state, loading } = storeToRefs(stores.workshop);

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

    await stores.workshop.updateIssues(token);
    state.value = 'NEW';
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
