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
              v-model="currentWorkshop.name"
              type="text"
              title="工作坊名稱"
              placeholder="工作坊名稱"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentWorkshop.description"
              type="textarea"
              title="工作坊描述"
              placeholder="工作坊描述"
              input-classes="h-28"
              :disabled="formDisabled"
            />
            <InputDatePicker
              v-model:date-value="currentWorkshop.dateValue"
              title="工作坊時間"
              :disabled="formDisabled"
            />
            <div
              class="text-center text-xs font-medium leading-snug text-black text-opacity-60 lg:text-sm"
            >
              預先設定工作坊POEMS分類
            </div>
            <InputChips
              v-model:chips="currentWorkshop.objects"
              title="Object - 物件 or 技術"
            />
            <InputChips
              v-model:chips="currentWorkshop.environments"
              title="Environment - 環境 or 場景"
            />
            <InputChips
              v-model:chips="currentWorkshop.messages"
              title="Message - 訊息 or 目標"
            />
            <InputChips
              v-model:chips="currentWorkshop.services"
              title="Service - 服務、行動 or 經驗"
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
            <WorkshopTableHeader
              v-for="tableHeader in tableHeaders"
              :key="tableHeader"
            >
              {{ tableHeader }}
            </WorkshopTableHeader>
          </tr>
        </WorkshopTableHead>
        <tbody>
          <WorkshopTableRow
            :active="!activeId"
            @click="() => stores.workshops.changeActiveWorkshop()"
          >
            <WorkshopTableData colspan="5">
              <Icon
                name="mdi:plus-circle-outline"
                class="h-4 w-4 lg:h-8 lg:w-8"
              />
            </WorkshopTableData>
          </WorkshopTableRow>
          <ClientOnly>
            <WorkshopTableConent />
            <template #fallback>
              <WorkshopTableContentSkeleton :n-rows="5" />
            </template>
          </ClientOnly>
        </tbody>
      </WorkshopTable>
    </WorkshopTablePanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import { FormPanelProps, FormStateKey } from '~/types';

const ActionsComponents: Partial<
  Record<FormStateKey, ConcreteComponent | string>
> = {
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
