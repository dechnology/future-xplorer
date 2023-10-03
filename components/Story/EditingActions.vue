<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
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
const { currentStory, activeStories, activeId, state, loading } = storeToRefs(
  stores.story
);

const handleCancel = () => {
  currentStory.value = { ...activeStories.value[0] };
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    // if (isEqual(currentStory.value, activeStories.value)) {
    //   state.value = 'DETAILS';
    //   return;
    // }

    const token = await getTokenSilently();
    const story = NewStorySchema.parse(currentStory.value);

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
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
