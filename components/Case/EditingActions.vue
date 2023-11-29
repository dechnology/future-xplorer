<template>
  <div
    v-if="currentCase.image || imageUrl"
    class="flex items-center justify-center"
  >
    <CardButton
      class="rounded-lg bg-red-400 text-white"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="() => handleImageRemove()"
    >
      刪除圖片
    </CardButton>
  </div>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="() => stores.case.resetForm()"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white"
      :class="!loading && 'hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleSaveEdit"
    >
      儲存
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

const handleImageRemove = () => {
  currentCase.value.image = null;
  stores.case.resetImage();
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentCase.value, activeCase.value) && !imageUrl.value) {
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
      `/api/cases/${activeId.value}`,
      { method: 'put', body: el }
    );
    console.log('Patched: ', editedCase);

    token = await getTokenSilently();
    stores.case.update(token);
    state.value = 'DETAILS';
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
