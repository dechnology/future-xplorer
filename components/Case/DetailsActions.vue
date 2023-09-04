<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleRemove"
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      body="刪除"
    />
    <CardButton
      @click.prevent="handleEdit"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="編輯"
    />
    <CardButton
      @click.prevent="handleKeyword"
      class="rounded-lg bg-lime-600 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="關鍵字"
    />
  </div>
</template>

<script setup lang="ts">
import { Case } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
  modal: useModalStore(),
};
const { activeId, state, loading } = storeToRefs(stores.case);

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active case to remove');
    }

    const token = await getTokenSilently();
    const { message } = await fetchResource<Case>(
      token,
      `/api/cases/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    state.value = 'NEW';
    stores.issue.removeCase(activeId.value);
    console.log('case removed');
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  state.value = 'EDITING';
};

const handleKeyword = () => {
  stores.modal.show();
};
</script>
