<template>
  <ul class="flex items-center">
    <slot />
  </ul>
</template>

<script setup lang="ts">
const stores = {
  issue: useIssueStore(),
};

onMounted(() => {
  stores.issue.setTab(readCurrentTab());
});
</script>
