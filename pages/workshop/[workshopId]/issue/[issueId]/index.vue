<template>
  <transition name="fade" mode="out-in">
    <component :is="Tabs[currentTab.name]" />
  </transition>
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import { IssueTabKeys } from '~/types';

const Tabs: Record<IssueTabKeys, ConcreteComponent | string> = {
  persona: resolveComponent('PersonaTab'),
  case: resolveComponent('CaseTab'),
  keyword: resolveComponent('KeywordTab'),
} as const;

const { getTokenSilently } = useAuth();
const route = useRoute();
const workshopId = route.params.workshopId as string;
const issueId = route.params.issueId as string;

const stores = {
  issue: useIssueStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const { workshop, issue, currentTab } = storeToRefs(stores.issue);

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.issue.init(token, workshopId, issueId);
  stores.breadcrumbs.setWorkshop(
    workshop.value ? workshop.value.name : 'error',
    `/workshop/${workshopId}`
  );
  stores.breadcrumbs.setIssue(
    issue.value ? issue.value.title : 'error',
    route.fullPath
  );
});
</script>
