<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="() => stores.story.clearCurrentStory()"
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
import type { User, Story } from '@/types';
import { NewStorySchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { issueId } = storeToRefs(stores.issue);
const { currentStory, loading } = storeToRefs(stores.story);

const handleCreate = async () => {
  try {
    loading.value = true;

    console.log(currentStory.value);

    const token = await getTokenSilently();
    const story = NewStorySchema.parse(currentStory.value);

    console.log('Creating: ', story);
    const { data: createdStory } = await fetchResource<Story>(
      token,
      `/api/issues/${issueId.value}/stories`,
      {
        method: 'post',
        body: { ...story },
      }
    );

    createdStory.creator = user.value as User;

    console.log('Created: ', createdStory);
    stores.story.upsertStory(createdStory);
    stores.story.toggleActiveStory(createdStory);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
