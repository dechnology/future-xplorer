<template>
  <div class="bg-lime-600">
    <div
      class="mx-auto flex shrink-0 items-center justify-between px-5 py-1 md:px-14 md:py-3"
    >
      <HomeLink>創新情境生成工具</HomeLink>
      <div class="flex items-center gap-2">
        <IssueNav v-if="$route.params.issueId">
          <IssueNavItem
            v-for="(t, key) in IssueTabs"
            :key="`${key}_${t.title}`"
            :active="key === currentTab.name"
            @click="() => stores.issue.setTab(t)"
          >
            {{ t.title }}
          </IssueNavItem>
        </IssueNav>
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
