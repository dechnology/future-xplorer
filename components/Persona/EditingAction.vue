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
import { NewIssueSchema, User, Issue } from '@/types';

const { user, getTokenSilently } = await useAuth();
const store = useWorkshopStore();
const { currentIssue, activeId, activeIssue, loading } = storeToRefs(store);

const handleCancel = () => {
  store.changeActiveIssue(activeIssue.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;
    const token = await getTokenSilently();
    const i = NewIssueSchema.parse(currentIssue.value);

    console.log('Patching: ', i);
    const { data: editedIssue } = await fetchResource<Issue>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'put', body: i }
    );

    editedIssue.creator = user.value as User;
    console.log('Patched: ', editedIssue);
    store.upsert(editedIssue);
    store.changeActiveIssue(editedIssue);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
