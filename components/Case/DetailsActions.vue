<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      @click.prevent="handleRemove"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      @click.prevent="handleEdit"
    >
      編輯
    </CardButton>
    <CardButton
      class="rounded-lg bg-lime-600 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      @click.prevent="handleKeyword"
    >
      關鍵字
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { Case } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
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

    stores.case.removeCase(activeId.value);
    stores.case.changeActiveCase();
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
