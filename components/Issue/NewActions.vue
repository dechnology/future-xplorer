<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleClear"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="清除"
    />
    <CardButton
      @click.prevent="handleCreate"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="新增"
    />
  </div>
</template>

<script setup lang="ts">
import { NewIssueSchema, User, Issue } from '@/types';

const { user, getTokenSilently } = useAuth();
const store = useWorkshopStore();
const { workshopId, currentIssue, loading } = storeToRefs(store);

const handleClear = () => {
  store.clearCurrentIssue();
};

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!workshopId.value) {
      throw new Error('workshop id undefined');
    }

    const token = await getTokenSilently();
    const i = NewIssueSchema.parse(currentIssue.value);

    console.log('Creating: ', i);
    const { data: createdIssue } = await fetchResource<Issue>(
      token,
      `/api/workshops/${workshopId.value}/issues`,
      {
        method: 'post',
        body: i,
      }
    );
    createdIssue.creator = user.value as User;

    console.log('Created: ', createdIssue);
    store.upsert(createdIssue);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
