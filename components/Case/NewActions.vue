<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 text-white"
      :class="!loading && 'hover:bg-red-500'"
      :disabled="loading"
      @click.prevent="() => stores.case.resetForm()"
    >
      <span class="py-3"> 清除 </span>
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 text-white"
      :class="!loading && 'hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="handleCreate"
    >
      <span class="py-3"> 新增 </span>
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 text-white"
      :class="!loading && 'hover:bg-indigo-600'"
      :disabled="loading"
      @click.prevent="() => stores.modal.show()"
    >
      <span class="py-3"> 歷史案例 </span>
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { Case } from '@/types';
import { NewCaseSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  case: useCaseStore(),
};
const { issue, issueId } = storeToRefs(stores.issue);
const { currentCase, imageFile, imageUrl, loading } = storeToRefs(stores.case);

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!(issueId.value && issue.value)) {
      throw new Error('issue undefined');
    }

    currentCase.value = {
      ...getDefaultCase(),
      ...Object.fromEntries(
        Object.entries(currentCase.value).filter(([k, v]) => v)
      ),
    };

    const el = NewCaseSchema.parse(currentCase.value);

    let token: string = '';
    if (imageUrl.value) {
      token = await getTokenSilently();
      const { data: uploadedUrl } = await uploadImageToS3(
        token,
        imageUrl.value,
        imageFile.value
      );
      el.image = uploadedUrl;
    }

    console.log('Creating: ', el);
    token = await getTokenSilently();
    const { data: createdCase } = await fetchResource<Case>(
      token,
      `/api/issues/${issueId.value}/cases`,
      {
        method: 'post',
        body: el,
      }
    );
    console.log('Created: ', createdCase);

    token = await getTokenSilently();
    await stores.case.update(token);
    stores.case.resetForm();
    stores.case.resetImage();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
