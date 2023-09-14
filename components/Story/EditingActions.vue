<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="取消"
      @click.prevent="handleCancel"
    />
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="儲存"
      @click.prevent="handleSaveEdit"
    />
  </div>
</template>

<script setup lang="ts">
// import { isEqual } from 'lodash';
import type { User, Story } from '@/types';
import { NewStorySchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { currentStory, activeStory, activeId, state, loading } = storeToRefs(
  stores.story
);

const handleCancel = () => {
  stores.story.changeActiveStory(activeStory.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    // if (isEqual(currentStory.value, activeStory.value)) {
    //   state.value = 'DETAILS';
    //   return;
    // }

    const token = await getTokenSilently();
    const story = NewStorySchema.passthrough().parse(currentStory.value);

    console.log('Patching: ', story);
    const { data: editedStory } = await fetchResource<Story>(
      token,
      `/api/stories/${activeId.value}`,
      {
        method: 'put',
        body: story,
      }
    );

    editedStory.creator = user.value as User;
    console.log('Patched: ', editedStory);
    stores.story.upsertStory(editedStory);
    stores.story.changeActiveStory(editedStory);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
