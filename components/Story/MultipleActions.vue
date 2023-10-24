<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-lime-600 px-8 py-3 text-white hover:bg-lime-700"
      @click.prevent="handleCombineStory"
    >
      AI組合故事
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
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const { activeStories } = storeToRefs(stores.story);

const handleCombineStory = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    console.log('Combining story...');
    let token = await getTokenSilently();
    const { story: newStory } = await generateStoryCombine(token, {
      workshop: workshop.value,
      issue: issue.value,
      stories: activeStories.value.map((story) => ({
        title: story.title,
        content: story.content,
      })),
    });

    // Use function call to generate context for the AI generated story
    console.log('Creating: ', newStory);
    token = await getTokenSilently();
    const { data: createdStory } = await fetchResource<Story>(
      token,
      `/api/issues/${issueId.value}/stories`,
      {
        method: 'post',
        body: newStory,
      }
    );
    console.log('Created: ', createdStory);

    token = await getTokenSilently();
    await stores.story.update(token);
    activeStories.value = [];
  } catch (e) {
    console.error(e);
  }
};
</script>
