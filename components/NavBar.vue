<template>
  <div class="bg-lime-600">
    <div
      class="mx-auto flex h-20 w-[1920px] shrink-0 items-center justify-between px-14"
    >
      <HomeLink>未來情境探索輔助工具</HomeLink>
      <div class="flex items-center gap-2">
        <ul v-if="$route.params.issueId" class="flex items-center">
          <IssueNavItem
            v-for="(t, key) in IssueTabs"
            :key="`${key}_${t.title}`"
            @click="() => (currentTab = t)"
            :active="key === currentTab.name"
          >
            {{ t.title }}
          </IssueNavItem>
        </ul>
        <Logout></Logout>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IssueTabs } from '~/types';

const stores = {
  issue: useIssueStore(),
};
const { currentTab } = storeToRefs(stores.issue);
</script>
