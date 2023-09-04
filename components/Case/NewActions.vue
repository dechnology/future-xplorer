<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="() => stores.case.clearCurrentCase()"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="清除"
    />
    <CardButton
      @click.prevent="handleCreate"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="新增"
    />
    <CardButton
      @click.prevent="handleCreate"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="歷史案例"
    />
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

    if (imageUrlBuffer.value) {
      currentCase.value.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${currentCase.value.image}`);
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

    console.log('Created: ', createdCase);
    issue.value.cases.push(createdCase);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
