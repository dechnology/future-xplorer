<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="handleClear"
    >
      清除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { NewIssueSchema, Issue } from '@/types';

const { getTokenSilently } = useAuth();
const stores = { workshop: useWorkshopStore() };
const { workshopId, currentIssue, loading } = storeToRefs(stores.workshop);

const handleClear = () => {
  stores.workshop.clearCurrentIssue();
};

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!workshopId.value) {
      throw new Error('workshop id undefined');
    }

    currentIssue.value = {
      ...getDefaultIssue(),
      ...Object.fromEntries(
        Object.entries(currentIssue.value).filter(([k, v]) => v)
      ),
    };

    const el = NewIssueSchema.parse(currentIssue.value);

    console.log('Creating: ', el);
    let token = await getTokenSilently();
    const { data: createdIssue } = await fetchResource<Issue>(
      token,
      `/api/workshops/${workshopId.value}/issues`,
      {
        method: 'post',
        body: el,
      }
    );
    console.log('Created: ', createdIssue);

    token = await getTokenSilently();
    await stores.workshop.updateIssues(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
