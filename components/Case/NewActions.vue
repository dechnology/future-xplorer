<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="() => stores.case.clearCurrentCase()"
    >
      清除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      歷史案例
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { User, Case } from '@/types';
import { NewCaseSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
};
const { issue, issueId } = storeToRefs(stores.issue);
const { currentCase, imageFileBuffer, imageUrlBuffer, loading } = storeToRefs(
  stores.case
);

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!(issueId.value && issue.value)) {
      throw new Error('issue undefined');
    }

    const token = await getTokenSilently();
    const c = NewCaseSchema.parse(currentCase.value);

    console.log(imageFileBuffer.value);

    if (imageUrlBuffer.value) {
      c.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${c.image}`);
    }

    console.log('Creating: ', c);
    const { data: createdCase } = await fetchResource<Case>(
      token,
      `/api/issues/${issueId.value}/cases`,
      {
        method: 'post',
        body: c,
      }
    );
    createdCase.creator = user.value as User;
    createdCase.keywords = [];

    console.log('Created: ', createdCase);
    stores.case.upsertCase(createdCase);
    stores.case.changeActiveCase(createdCase);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
