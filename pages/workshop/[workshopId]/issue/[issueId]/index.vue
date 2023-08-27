<template>
  <NuxtLayout>
    <template #form>
      <IssueFormTabsWrapper>
        <IssueFormTab :tab="{ name: 'personas', title: '人物清單' }">
          <PersonaFormTab />
        </IssueFormTab>
      </IssueFormTabsWrapper>
    </template>
    gallery
  </NuxtLayout>
</template>

<script setup lang="ts">
onMounted(async () => {
  const { getTokenSilently } = await useAuth();
  const route = useRoute();

  const stores = {
    issue: useIssueStore(),
    breadcrumbs: useBreadcrumbsStore(),
  };

  const { workshop, issue } = storeToRefs(stores.issue);

  const token = await getTokenSilently();
  const workshopId = route.params.workshopId as string;
  const issueId = route.params.issueId as string;
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
