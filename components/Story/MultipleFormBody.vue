<template>
  <InputComponent
    v-for="(story, idx) in activeStories"
    :key="story._id"
    v-model="story.content"
    type="textarea"
    :title="`故事 #${idx}: ${story.title}`"
    placeholder="故事內容"
    input-classes="h-[100px] xl:h-[200px]"
    disabled
  />
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { activeStories } = storeToRefs(stores.story);
</script>
