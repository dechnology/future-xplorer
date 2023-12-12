<template>
  <NuxtLayout>
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
            <template #tooltip>{{ tooltip }}</template>
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
              li-classes="text-white bg-black"
              title="Object - 物件 or 技術"
              :disabled="formDisabled"
              required-chip="技術"
            />
            <InputChips
              v-model:chips="currentWorkshop.environments"
              li-classes="text-white bg-black"
              title="Environment - 環境 or 場景"
              :disabled="formDisabled"
              required-chip="場景體驗"
            />
            <InputChips
              v-model:chips="currentWorkshop.messages"
              li-classes="text-white bg-black"
              title="Message - 訊息 or 目標"
              :disabled="formDisabled"
              required-chip="洞見與價值"
            />
            <InputChips
              v-model:chips="currentWorkshop.services"
              li-classes="text-white bg-black"
              title="Service - 服務、行動 or 經驗"
              :disabled="formDisabled"
              required-chip="使用者體驗"
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
          <WorkshopTableRow :active="!activeId" @click="activeWorkshop = null">
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
const tooltip = [
  'Case. 如何新增工作坊？',
  '1. 點擊右側工作坊列表最上方的加(+)號列，左側面板將會切換為「新增工作坊」模式',
  '2. 依序輸入：工作坊名稱、工作坊描述、工作坊時間',
  '3. 工作坊時間欄位的下方區塊是POEMS模板中的OEMS四大元素的分類選項，根據TDRI（台灣設計研究院）的研究成果，預先針對OEMS分別建立：技術、場景體驗、洞見與價值、使用者體驗，四大分類。管理者可以在正式開始工作坊流程前，預先在OEMS下，自定義新的類別為後續流程分析做準備。',
  '4. 當資訊都輸入完畢後，按下「新增」按鈕，就會出現在右方的工作坊列表。',
  '',
  'Case. 如何查看工作坊資訊？',
  '當我們有多個工作坊排程時，可以透過以下方式查看工作坊資訊：',
  '1. 控制游標在列表上移動，此時所在位置的工作坊會以不同顏色呈現',
  '2. 「單擊」工作坊，左側面板將會切換為「工作坊資訊」模式',
  '3. 在左側面板查看資訊',
  '',
  'Case. 如何修改工作坊資訊？',
  '> 當我們想修改某個工作坊排程時，可以透過以下方式修改工作坊資訊：',
  '1. 控制游標在列表上移動，此時所在位置的工作坊會以不同顏色呈現',
  '2. 「單擊」工作坊，左側面板將會切換為「工作坊資訊」模式',
  '3. 點擊左側面板的「編輯」按鈕，所有欄位將變成可編輯狀態',
  '4. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何刪除工作坊？',
  '> 當我們想刪除某個工作坊排程時，可以透過以下方式刪除工作坊資訊：',
  '1. 控制游標在列表上移動，此時所在位置的工作坊會以不同顏色呈現',
  '2. 「單擊」工作坊，左側面板將會切換為「工作坊資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與工作坊相關的資訊，並進入新增工作坊模式',
  '',
  'Case. 如何進入工作坊？',
  '> 當我們想進入某個工作坊時，可以透過兩種方式：',
  '1. 控制游標在列表上移動，此時所在位置的工作坊會以不同顏色呈現，此時「雙擊」工作坊所在的列，畫面將會跳到公作坊的子議題選擇畫面',
  '2. 控制游標在列表上移動，此時所在位置的工作坊會以不同顏色呈現，此時「單擊」工作坊，左側面板將會切換為「工作坊資訊」模式。點擊左側面板的「開始」按鈕，系統將會跳到公作坊的子議題選擇畫面',
].join('\n');

const { username } = useAuth();

const stores = {
  workshops: useWorkshopsStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  currentWorkshop,
  activeWorkshop,
  activeId,
  state,
  formDisabled,
  currentFormCardProps,
} = storeToRefs(stores.workshops);

onMounted(() => {
  stores.breadcrumbs.clearAll();
});
</script>
