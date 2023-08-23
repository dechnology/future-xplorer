<template>
  <div class="flex h-full flex-col gap-2">
    <KeywordTab v-model="tab" />
    <KeywordGallery
      class="grow overflow-y-auto"
      :category-filter="tab"
      draggable
    />
  </div>
</template>

<script setup lang="ts">
const issueStore = useIssueStore();
const { elements } = storeToRefs(issueStore);
const tab = ref<string | null>(null);

onMounted(() => {
  if (!elements.value) {
    return;
  }

  const { objects, environments, messages, services } = elements.value;
  tab.value = [...objects, ...environments, ...messages, ...services][0];
});
</script>
