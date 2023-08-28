<template>
  <ul class="flex items-center">
    <IssueNavItem
      v-for="t in IssueTabs"
      :key="`${t.name}_${t.title}`"
      @click="() => handleClick(t.name)"
      :active="t.name === currentTabName"
    >
      {{ t.title }}
    </IssueNavItem>
  </ul>
</template>

<script setup lang="ts">
import { IssueTabKeys, IssueTabs } from '~/types';

const stores = {
  issue: useIssueStore(),
};

const { currentTabName } = storeToRefs(stores.issue);

const handleClick = (name: IssueTabKeys) => {
  currentTabName.value = name;
  console.log(currentTabName.value);
};
</script>
