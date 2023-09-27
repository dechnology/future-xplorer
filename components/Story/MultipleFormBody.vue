<template>
  <InputComponent
    v-for="(story, idx) in currentStories"
    :key="`${'_id' in story ? story._id : story.title}-${idx}`"
    v-model="story.title"
    type="textarea"
    :title="`故事 #${idx}: ${story.title}`"
    placeholder="故事內容"
    input-classes="h-[200px]"
  />
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { currentStories } = storeToRefs(stores.story);
</script>
