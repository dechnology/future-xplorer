<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import { NewIssueSchema, Issue } from '@/types';

const { getTokenSilently } = useAuth();
const stores = { workshop: useWorkshopStore() };
const { currentIssue, activeId, activeIssue, state, loading } = storeToRefs(
  stores.workshop
);

const handleCancel = () => {
  stores.workshop.changeActiveIssue(activeIssue.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentIssue.value, activeIssue.value)) {
      state.value = 'DETAILS';
      return;
    }

    let token = await getTokenSilently();
    const el = NewIssueSchema.parse(currentIssue.value);

    console.log('Patching: ', el);
    const { data: editedIssue } = await fetchResource<Issue>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'put', body: el }
    );
    console.log('Patched: ', editedIssue);

    token = await getTokenSilently();
    await stores.workshop.updateIssues(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
