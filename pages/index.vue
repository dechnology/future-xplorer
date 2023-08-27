<template>
  <NuxtLayout>
    <template #form>
      <FormPanel v-bind="formPanelProps">
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
          <template #action>
            <component :is="ActionComponents[state]" />
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
            <WorkshopTableBodyConent />
            <template #fallback> loading... </template>
          </Suspense>
          <!-- Should be async component -->
          <!-- <WorkshopTableRow
            v-for="w in workshops"
            :key="w._id"
            :active="w._id === activeId"
            @dblclick="() => handleDblclick(w._id)"
            @click="() => stores.workshops.changeActiveWorkshop(w)"
          >
            <WorkshopTableData v-for="datum in getWorkshopData(w)">
              {{ datum }}
            </WorkshopTableData>
          </WorkshopTableRow> -->
          <!-- Should be async component (end) -->
        </tbody>
      </WorkshopTable>
    </WorkshopTablePanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Workshop } from '@/types';

const ActionComponents = {
  NEW: resolveComponent('WorkshopNewAction'),
  DETAILS: resolveComponent('WorkshopDetailsAction'),
  EDITING: resolveComponent('WorkshopEditingAction'),
} as const;

const tableHeaders = ['名稱', '工作坊時間', '建立者', '建立日期', '更新日期'];
const formPanelProps = {
  panelTitle: '場次列表',
  panelDescription: '工作坊的管理頁面：管理工作坊的活動場次',
};

const { username, getTokenSilently } = useAuth();
const router = useRouter();

const stores = {
  workshops: useWorkshopsStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  workshops,
  currentWorkshop,
  activeId,
  state,
  formDisabled,
  currentFormCardProps,
} = storeToRefs(stores.workshops);

// const getWorkshopData = (w: Workshop) => [
//   w.name,
//   `${w.dateValue.start} - ${w.dateValue.end}`,
//   w.creator.name,
//   formatDate(w.createdAt),
//   formatDate(w.updatedAt),
// ];

// const handleDblclick = (id: string) => {
//   router.push(`/workshop/${id}`);
// };

onMounted(async () => {
  // const token = await getTokenSilently();
  // await stores.workshops.init(token);
  stores.breadcrumbs.clearAll();
});
</script>
