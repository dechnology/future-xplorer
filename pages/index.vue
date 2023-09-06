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
              type="text"
              title="工作坊名稱"
              placeholder="工作坊名稱"
              v-model="currentWorkshop.name"
              :disabled="formDisabled"
            />
            <InputComponent
              type="textarea"
              title="工作坊描述"
              placeholder="工作坊描述"
              v-model="currentWorkshop.description"
              input-classes="h-28"
              :disabled="formDisabled"
            />
            <div
              class="text-center text-sm font-medium leading-snug text-black text-opacity-60"
            >
              預先設定工作坊POEMS分類
            </div>
            <InputChips
              title="Object - 物件 or 技術"
              v-model:chips="currentWorkshop.objects"
            />
            <InputChips
              title="Environment - 環境 or 場景"
              v-model:chips="currentWorkshop.environments"
            />
            <InputChips
              title="Message - 訊息 or 目標"
              v-model:chips="currentWorkshop.messages"
            />
            <InputChips
              title="Service - 服務、行動 or 經驗"
              v-model:chips="currentWorkshop.services"
            />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <WorkshopTablePanel>
      <WorkshopTable>
        <WorkshopTableHead>
          <tr>
            <WorkshopTableHeader v-for="tableHeader in tableHeaders">
              {{ tableHeader }}
            </WorkshopTableHeader>
          </tr>
        </WorkshopTableHead>
        <tbody>
          <WorkshopTableRow
            @click="() => stores.workshops.changeActiveWorkshop()"
            :active="!activeId"
          >
            <WorkshopTableData colspan="5">
              <Icon name="mdi:plus-circle-outline" size="2rem" />
            </WorkshopTableData>
          </WorkshopTableRow>
          <Suspense>
            <WorkshopTableConent />
            <template #fallback> loading... </template>
          </Suspense>
        </tbody>
      </WorkshopTable>
    </WorkshopTablePanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { FormPanelProps } from '~/types';

const ActionsComponents = {
  NEW: resolveComponent('WorkshopNewActions'),
  DETAILS: resolveComponent('WorkshopDetailsActions'),
  EDITING: resolveComponent('WorkshopEditingActions'),
} as const;

const tableHeaders = ['名稱', '工作坊時間', '建立者', '建立日期', '更新日期'];
const formPanelProps: FormPanelProps = {
  title: '場次列表',
  description: '工作坊的管理頁面：管理工作坊的活動場次',
};

const { username } = useAuth();

const stores = {
  workshops: useWorkshopsStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const { currentWorkshop, activeId, state, formDisabled, currentFormCardProps } =
  storeToRefs(stores.workshops);

onMounted(() => {
  stores.breadcrumbs.clearAll();
});
</script>
