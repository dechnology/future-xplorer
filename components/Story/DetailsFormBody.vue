<template>
  <InputComponent
    v-model="currentStory.title"
    type="text"
    title="標題"
    placeholder="故事標題"
    :disabled="formDisabled"
  />
  <InputComponent
    v-model="currentStory.content"
    type="textarea"
    title="故事內容"
    placeholder="故事內容"
    :disabled="formDisabled"
    input-classes="h-[200px]"
  />
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  story: useStoryStore(),
};
const { currentStory, formDisabled } = storeToRefs(stores.story);
</script>
