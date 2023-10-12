<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 text-white"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="() => stores.case.resetForm()"
    >
      <span class="py-3"> 取消 </span>
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 text-white"
      :class="!loading && 'hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleSaveEdit"
    >
      <span class="py-3"> 儲存 </span>
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import type { Case } from '@/types';
import { NewCaseSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  case: useCaseStore(),
};
const {
  currentCase,
  activeCase,
  activeId,
  imageFile,
  imageUrl,
  state,
  loading,
} = storeToRefs(stores.case);

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentCase.value, activeCase.value)) {
      state.value = 'DETAILS';
      return;
    }

    let token = '';
    const el = NewCaseSchema.parse(currentCase.value);

    if (imageUrl.value) {
      token = await getTokenSilently();
      const { data: uploadedUrl } = await uploadImageToS3(
        token,
        imageUrl.value,
        imageFile.value
      );
      el.image = uploadedUrl;
    }

    console.log('Patching: ', el);
    token = await getTokenSilently();
    const { data: editedCase } = await fetchResource<Case>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'put', body: el }
    );
    console.log('Patched: ', editedCase);

    token = await getTokenSilently();
    stores.case.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
