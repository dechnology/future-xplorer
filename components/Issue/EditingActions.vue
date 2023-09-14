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
// import { isEqual } from 'lodash';
import { NewIssueSchema, User, Issue } from '@/types';

const { user, getTokenSilently } = await useAuth();
const store = useWorkshopStore();
const { currentIssue, activeId, activeIssue, state, loading } =
  storeToRefs(store);

const handleCancel = () => {
  store.changeActiveIssue(activeIssue.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    // if (isEqual(currentIssue.value, activeIssue.value)) {
    //   state.value = 'DETAILS';
    //   return;
    // }

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
