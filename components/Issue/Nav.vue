<template>
  <ul class="flex items-center">
    <IssueNavItem
      v-for="t in IssueTabs"
      :key="`${t.name}_${t.title}`"
      @click="() => (currentTab = t)"
      :active="t.name === currentTab.name"
    >
      {{ t.title }}
    </IssueNavItem>
  </ul>
</template>

<script setup lang="ts">
import { IssueTabs } from '~/types';

const stores = {
  issue: useIssueStore(),
};
const { currentTab } = storeToRefs(stores.issue);
</script>
