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
import type { User, Case } from '@/types';
import { NewCaseSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  case: useCaseStore(),
};
const {
  currentCase,
  activeCase,
  activeId,
  imageFileBuffer,
  imageUrlBuffer,
  state,
  loading,
} = storeToRefs(stores.case);

const handleCancel = () => {
  stores.case.changeActiveCase(activeCase.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (_.isEqual(currentCase.value, activeCase.value)) {
      state.value = 'DETAILS';
      return;
    }

    const token = await getTokenSilently();
    const c = NewCaseSchema.parse(currentCase.value);

    if (imageUrlBuffer.value) {
      c.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${c.image}`);
    }

    console.log('Patching: ', c);
    const { data: editedCase } = await fetchResource<Case>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'put', body: c }
    );

    editedCase.creator = user.value as User;
    console.log('Patched: ', editedCase);
    activeCase.value = editedCase;
    stores.case.changeActiveCase(editedCase);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
