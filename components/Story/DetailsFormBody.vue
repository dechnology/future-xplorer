<template>
  <InputComponent
    v-model="currentStory.title"
    type="text"
    title="標題"
    placeholder="故事標題"
    :disabled="formDisabled"
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
