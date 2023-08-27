<template>
  <ol class="flex items-center">
    <IssueNavItem v-for="t in tabs" @click="() => handleClick(t)">
      {{ t.title }}
    </IssueNavItem>
  </ol>
</template>

<script setup lang="ts">
const stores = {
  issue: useIssueStore(),
};
const { issue } = storeToRefs(stores.issue);

const tabs = [
  { name: 'test1', title: 'testTitle1' },
  { name: 'test2', title: 'testTitle2' },
  { name: 'test3', title: 'testTitle3' },
];

const handleClick = (t) => {};
</script>
