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
import { Story, User } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const { currentStories, state } = storeToRefs(stores.story);

const handleCombineStory = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const newTitle = `AI組合故事: ${currentStories.value
      .map((story) => story.title)
      .join(' ')}`;

    const token = await getTokenSilently();

    console.log('Remaking story...');
    const { story: newStoryContent } = await generateStoryCombine(token, {
      workshop: workshop.value,
      issue: issue.value,
      stories: currentStories.value.map((story) => ({
        title: story.title,
        content: story.content,
      })),
    });

    // Use function call to generate context for the AI generated story
    console.log('Creating: ', newStoryContent);
    // const { context } = currentStories.value;
    const { data: createdStory } = await fetchResource<Story>(
      token,
      `/api/issues/${issueId.value}/stories`,
      {
        method: 'post',
        body: {
          title: newTitle,
          // context,
          content: newStoryContent,
        },
      }
    );

    createdStory.creator = user.value as User;

    console.log('Created: ', createdStory);
    stores.story.upsertStory(createdStory);
    stores.story.toggleActiveStory(createdStory);
  } catch (e) {
    console.error(e);
  }
};
</script>
