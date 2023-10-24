<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="() => stores.story.resetForm()"
    >
      清除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { Story } from '@/types';
import { NewStorySchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { issueId } = storeToRefs(stores.issue);
const { currentStory, loading } = storeToRefs(stores.story);

const handleCreate = async () => {
  try {
    loading.value = true;

    const story = NewStorySchema.parse(currentStory.value);
    console.log('Creating: ', story);

    let token = await getTokenSilently();
    const { data: createdStory } = await fetchResource<Story>(
      token,
      `/api/issues/${issueId.value}/stories`,
      {
        method: 'post',
        body: { ...story },
      }
    );
    console.log('Created: ', createdStory);

    token = await getTokenSilently();
    await stores.story.update(token);
    stores.story.resetForm();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
