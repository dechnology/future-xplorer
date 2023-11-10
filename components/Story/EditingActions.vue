<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white hover:bg-red-500"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import type { Story } from '@/types';
import { NewStorySchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  story: useStoryStore(),
};
const { currentStory, activeStories, activeId, loading } = storeToRefs(
  stores.story
);

const handleCancel = () => {
  currentStory.value = { ...activeStories.value[0] };
  stores.story.resetForm();
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentStory.value, activeStories.value)) {
      stores.story.resetForm();
      return;
    }

    const story = NewStorySchema.parse(currentStory.value);

    console.log('Patching: ', story);
    let token = await getTokenSilently();
    const { data: editedStory } = await fetchResource<Story>(
      token,
      `/api/stories/${activeId.value}`,
      {
        method: 'put',
        body: story,
      }
    );
    console.log('Patched: ', editedStory);

    token = await getTokenSilently();
    await stores.story.update(token);
    activeStories.value = [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
