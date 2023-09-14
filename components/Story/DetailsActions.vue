<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      body="刪除"
      @click.prevent="handleRemove"
    />
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white transition-all hover:bg-opacity-50"
      body="編輯"
      @click.prevent="handleEdit"
    />
  </div>
</template>

<script setup lang="ts">
import { Story } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  story: useStoryStore(),
};
const { activeId, state, loading } = storeToRefs(stores.story);

const handleRemove = async () => {
  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active story to remove');
    }

    const token = await getTokenSilently();
    const { message } = await fetchResource<Story>(
      token,
      `/api/stories/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(message);

    stores.story.removeStory(activeId.value);
    stores.story.changeActiveStory();
    console.log('story removed');
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
