<template>
  <NuxtLayout>
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
          </PanelHeader>
        </template>
        <FormCard v-bind="currentFormCardProps" :username="username">
          <template #body>
            <InputComponent
              v-model="currentIssue.title"
              type="text"
              title="議題名稱"
              placeholder="議題名稱"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentIssue.description"
              type="textarea"
              title="議題描述"
              placeholder="議題描述"
              input-classes="h-80"
              :disabled="formDisabled"
            />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery>
        <Card
          :active="!activeId"
          class="h-[300px]"
          @click="() => stores.workshop.changeActiveIssue()"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增議題
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="i in issues"
          :key="i._id"
          :active="activeId === i._id"
          class="h-[300px]"
          @dblclick="() => handleDblclick(i._id)"
          @click="() => stores.workshop.changeActiveIssue(i)"
        >
          <CardTitle>{{ i.title }} </CardTitle>
          <CardDescription>{{ i.description }} </CardDescription>
          <CardFootnote>
            {{
              [
                `建立者：${i.creator.name}`,
                `新增日期：${formatDate(i.createdAt)}`,
                `更新日期：${formatDate(i.updatedAt)}`,
              ].join('\n')
            }}
          </CardFootnote>
        </Card>
        <!-- Should be async component (end) -->
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { FormPanelProps } from '~/types';

const ActionsComponents = {
  NEW: resolveComponent('IssueNewActions'),
  DETAILS: resolveComponent('IssueDetailsActions'),
  EDITING: resolveComponent('IssueEditingActions'),
} as const;

const formPanelProps: FormPanelProps = {
  title: '議題列表',
  description:
    '第一步需先決定整體研究的核心主題為何，後續的所有情境都會需在這個主題架構下。',
};

const { username, getTokenSilently } = await useAuth();
const route = useRoute();
const router = useRouter();

const stores = {
  workshop: useWorkshopStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  workshop,
  workshopId,
  issues,
  currentIssue,
  activeId,
  state,
  formDisabled,
  currentFormCardProps,
} = storeToRefs(stores.workshop);

const handleDblclick = (issueId: string) => {
  router.push(`/workshop/${workshopId.value}/issue/${issueId}`);
};

onMounted(async () => {
  const token = await getTokenSilently();
  const workshopId = route.params.workshopId as string;
  await stores.workshop.init(token, workshopId);

  stores.breadcrumbs.clearIssue();
  if (workshop.value) {
    stores.breadcrumbs.setWorkshop(workshop.value.name, route.fullPath);
  }
});
</script>
