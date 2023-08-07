<template>
  <ol class="flex items-center gap-1">
    <NuxtLink
      to="/"
      class="transition-all hover:text-gray-600 active:text-gray-400"
    >
      <Icon name="mdi:home" size="1.25rem" />
    </NuxtLink>
    <li v-for="crumb in crumbs" class="flex items-center gap-1">
      <Icon name="mdi:circle-small" size="24px" />
      <NuxtLink
        :to="crumb.path"
        class="transition-all hover:text-gray-600 active:text-gray-400"
      >
        {{ crumb.name }}
      </NuxtLink>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { Workshop } from '@/types/workshop';
import { Issue } from '@/types/issue';

interface Crumb {
  name: string;
  path: string;
}

const route = useRoute();
const crumbs = ref<Crumb[]>([]);
const workshop = ref<Workshop>();
const issue = ref<Issue>();

const workshopParam = route.params.workshopId as string;
const issueParam = route.params.issueId as string;

if (workshopParam) {
  const workshopId = parseInt(workshopParam);
  const workshopPath = `/workshop/${workshopId}`;

  workshop.value = (await fetchWorkshopById(workshopId)).workshop;
  crumbs.value.push({ name: workshop.value.name, path: workshopPath });

  if (issueParam) {
    const issueId = parseInt(issueParam);
    const issuePath = `${workshopPath}/issue/${issueId}/people`;

    issue.value = await fetchIssueById(workshopId, issueId);
    crumbs.value.push({ name: issue.value.title, path: issuePath });
  }
}
</script>
