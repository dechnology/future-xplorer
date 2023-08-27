<template>
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

<script setup lang="ts">
import { Workshop } from '@/types';

const ActionComponents = {
  NEW: resolveComponent('WorkshopNewAction'),
  DETAILS: resolveComponent('WorkshopDetailsAction'),
  EDITING: resolveComponent('WorkshopEditingAction'),
} as const;

const formPanelProps = {
  panelTitle: '場次列表',
  panelDescription: '工作坊的管理頁面：管理工作坊的活動場次',
};

const { username, getTokenSilently } = await useAuth();
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

const getWorkshopData = (w: Workshop) => [
  w.name,
  `${w.dateValue.start} - ${w.dateValue.end}`,
  w.creator.name,
  formatDate(w.createdAt),
  formatDate(w.updatedAt),
];

const handleDblclick = (id: string) => {
  router.push(`/workshop/${id}`);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.workshops.init(token);
  stores.breadcrumbs.clearAll();
});
</script>
