<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white transition-all hover:bg-red-500"
      @click.prevent="handleRemove"
    >
      刪除
    </CardButton>
    <CardButton
      class="rounded-lg bg-lime-600 px-8 py-3 text-white hover:bg-lime-700"
      @click.prevent="handleRemakeStory"
    >
      AI編輯故事
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleEdit"
    >
      編輯
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { Story } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { currentStory, activeId, state, loading } = storeToRefs(stores.story);

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

const handleRemakeStory = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    currentStory.value.title = currentStory.value.title.trim();
    if (currentStory.value.title === '') {
      throw new Error('no story title');
    }

    const token = await getTokenSilently();

    console.log('Remaking story...');
    const { story } = await generateStoryRemake(token, {
      title: currentStory.value.title,
      workshop: workshop.value,
      issue: issue.value,
      content: currentStory.value.content,
    });

    currentStory.value.content = story;
  } catch (e) {
    console.error(e);
  }
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
