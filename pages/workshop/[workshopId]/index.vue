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
              input-classes="h-40 xl:h-80"
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
      <InputSearchBar v-model="searchQuery" @search="handleSearch" />
      <CardGallery>
        <Card
          :active="!activeId"
          class="h-[200px] xl:h-[300px]"
          @click="() => stores.workshop.changeActiveIssue()"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增議題
          </CardIcon>
        </Card>
        <ClientOnly>
          <Card
            v-for="i in issues"
            :key="i._id"
            :active="activeId === i._id"
            class="h-[200px] xl:h-[300px]"
            @dblclick="() => handleDblclick(i._id)"
            @click="() => stores.workshop.changeActiveIssue(i)"
          >
            <CardTitle>{{ i.title }}</CardTitle>
            <CardDescription>{{ i.description }}</CardDescription>
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
          <template #fallback> loading... </template>
        </ClientOnly>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormPanelProps, FormStateKey } from '~/types';

const ActionsComponents: Partial<
  Record<FormStateKey, string | ConcreteComponent>
> = {
  NEW: resolveComponent('IssueNewActions'),
  DETAILS: resolveComponent('IssueDetailsActions'),
  EDITING: resolveComponent('IssueEditingActions'),
} as const;

const formPanelProps: FormPanelProps = {
  title: '議題列表',
  description:
    '第一步需先決定整體研究的核心主題為何，後續的所有情境都會需在這個主題架構下。',
};
const tooltip = [
  'Case. 如何新增子議題？',
  '1. 點擊右側子議題卡牌中左上方的加(+)號卡牌，左側面板將會切換為「新增議題」模式',
  '2. 輸入「議題名稱」與「議題描述」',
  '3. 當資訊都輸入完畢後，按下「新增」按鈕，就會出現在右方的議題卡牌中。',
  '',
  'Case. 如何查看子議題資訊？',
  '> 當我們已經有了多個議題時，可以透過以下方式查看完整議題描述：',
  '1. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現',
  '2. 「單擊」議題卡牌，左側面板將會切換為「議題資訊」模式',
  '3. 在左側面板以滾動方式查看完整議題描述',
  '',
  'Case. 如何修改子議題資訊？',
  '> 當我們想修改某個子議題時，可以透過以下方式修改：',
  '1. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現',
  '2. 「單擊」議題卡牌，左側面板將會切換為「議題資訊」模式',
  '3. 點擊左側面板的「編輯」按鈕，所有欄位將變成可編輯狀態',
  '4. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何刪除子議題？',
  '> 當我們想刪除某個子議題時，可以透過以下方式刪除：',
  '1. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現',
  '2. 「單擊」議題卡牌，左側面板將會切換為「議題資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與子議題相關的資訊，並進入新增議題模式',
  '',
  'Case. 如何進入子議題？',
  '> 當我們想進入某個議題時，可以透過兩種方式：',
  '1. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現，此時「雙擊」議題所在的卡牌，畫面將會跳到開始探索議題的頁面',
  '2. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現，此時「單擊」議題卡牌，左側面板將會切換為「議題資訊」模式。點擊左側面板的「開始」按鈕，系統將會跳到開始探索議題的頁面',
].join('\n');

const { username, getTokenSilently } = useAuth();
const route = useRoute();
const router = useRouter();

const stores = {
  workshop: useWorkshopStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  workshop,
  workshopId,
  searchQuery,
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

const handleSearch = async () => {
  const token = await getTokenSilently();
  await stores.workshop.updateIssues(token);
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
