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
        <FormCard v-bind="formCardProps">
          <template #body>
            <InputComponent
              v-model="currentCase.title"
              type="text"
              title="標題"
              placeholder="案例標題"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.background"
              type="textarea"
              title="背景介紹"
              placeholder="案例背景"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.method"
              type="textarea"
              title="作法"
              placeholder="案例作法"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.goal"
              type="textarea"
              title="目標"
              placeholder="案例目標"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.challenge"
              type="textarea"
              title="問題與挑戰"
              placeholder="案例的問題與挑戰"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.result"
              type="textarea"
              title="成果"
              placeholder="案例成果"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.reference"
              type="textarea"
              title="參考資料"
              placeholder="案例參考資料"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.other"
              type="textarea"
              title="其他"
              placeholder="案例其他"
              input-classes="h-24 xl:h-[100px]"
              :disabled="formDisabled"
            />

            <div class="flex flex-col overflow-hidden rounded-lg">
              <Image
                v-model:file="imageFile"
                :url="currentImageUrl"
                :disabled="formDisabled"
                :image-state="imageState"
                @blob-url-created="(url) => (imageUrl = url)"
              />
            </div>
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions> </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <InputSearchBar v-model="searchQuery" @search="handleSearch" />
      <CardGallery>
        <Card
          :active="!activeCase"
          class="h-[200px] xl:h-[350px]"
          @click="() => (activeCase = null)"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增案例
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in cases"
          :key="el._id"
          :active="activeId === el._id"
          class="h-[200px] xl:h-[350px]"
          @dblclick="() => stores.modal.show()"
          @click="() => (activeCase = el)"
        >
          <template #absolute>
            <Icon
              :name="
                el.keywords.flatMap((kw) => kw.votes).length
                  ? 'mdi:star'
                  : 'mdi:star-outline'
              "
              class="absolute left-1 top-1 z-10 text-sky-950 xl:left-2 xl:top-2 xl:h-6 xl:w-6"
            />
          </template>
          <template #image>
            <CardImage :url="el.image" />
          </template>
          <CardDescription input-classes="leading-snug">
            {{
              [
                `標題：${el.title}`,
                `目標：${el.goal}`,
                `作法：${el.method}`,
              ].join('\n')
            }}
          </CardDescription>
          <CardFootnote>
            {{ `建立者：${el.creator.name}` }}
          </CardFootnote>
        </Card>
        <!-- Should be async component (end) -->
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
  <CaseModal />
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKey } from '~/types';

const formPanelProps = {
  title: '案例列表',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};
const tooltip = [
  'Case. 如何新增案例？',
  '1. 點擊右側子議題卡牌中左上方的加(+)號卡牌，左側面板將會切換為「新增案例」模式',
  '2. 依序輸入案例的：標題、背景介紹、作法、目標、問題與挑戰、成果、參考資料與其他資訊。',
  '- 當沒有頭緒的時候，可以參考歷史案例，在按下歷史案例後，會出現TDRI（台灣設計研究院）過往的精華案例可供參考，點擊後會將資訊帶入到新增案例面板的各個欄位',
  '3. 當案例資訊都輸入完畢後，可以上傳案例代表圖。此部分不支援AI生成。',
  '4. 最後按下「新增」按鈕，就會出現在右方的案例卡牌中。',
  '',
  'Case. 如何新增關鍵字？',
  '1. 雙擊右側案例卡牌，或是單擊後，點擊在左側的「關繫字」按鈕，此時將會以彈跳視窗顯示完整案例資訊與目前關鍵字卡牌',
  '2. 接下來有三種方式可以新增關鍵字：',
  '1. 自定義：此時可使用右側關鍵字卡牌區的左上角的加(+)號按鈕，點擊後可輸入自己發想的關鍵字',
  '2. 畫線選取：直接對案例資訊中的文字進行反白選取，在放開時，會在選取文字的旁邊出現一個「新增關鍵字」的按鈕，點擊後會加入右側的關鍵字卡牌區',
  '3. AI生成：透過點擊「AI生成關鍵字」讓AI解析文章內容後，自動擷取出關鍵字，放到右側關鍵字卡牌區',
  '3. 編輯完關鍵字後，可以點擊「關閉」按鈕，或是點擊背景，來關閉關鍵字編輯彈跳視窗',
  '',
  'Case. 如何查看案例資訊&關鍵字資訊？',
  '請參考新增關鍵字的第一步驟',
  '',
  'Case. 如何修改案例資訊？',
  '當我們想修改某筆案例時，可以透過以下方式修改：',
  '1. 控制游標在卡牌中移動，此時所在位置的案例卡牌會以不同顏色呈現',
  '2. 「單擊」案例卡牌，左側面板將會切換為「案例資訊」模式',
  '3. 點擊左側面板的「編輯」按鈕，所有欄位將變成可編輯狀態，細節可參考新增案例',
  '4. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何修改案例的關鍵字？',
  '當我們想修改某筆案例的關鍵字時，可以透過以下方式修改：',
  '1. 參考新增關鍵字第一步驟開啟關鍵字編輯彈跳視窗',
  '2. 分為編輯與刪除',
  '- 編輯：「雙擊」關鍵字卡牌的文字區，會開啟編輯功能，此時「單擊」文字任意處將可開始修改文字內容',
  '- 刪除：「單擊」關鍵字卡牌的「垃圾桶」按鈕',
  '',
  'Case. 如何刪除案例？',
  '當我們想刪除某筆案例時，可以透過以下方式刪除：',
  '1. 控制游標在卡牌中移動，此時所在位置的案例卡牌會以不同顏色呈現',
  '2. 「單擊」案例卡牌，左側面板將會切換為「案例資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與案例相關的資訊，並進入新增案例模式',
  '',
  'Case. 如何進入下一個流程？',
  '下一步是對關鍵字進行歸類，可以直接點擊上方的「案例整體」，開始整理',
].join('\n');

const ActionsComponents: Partial<
  Record<FormStateKey, ConcreteComponent | string>
> = {
  NEW: resolveComponent('CaseNewActions'),
  DETAILS: resolveComponent('CaseDetailsActions'),
  EDITING: resolveComponent('CaseEditingActions'),
} as const;

const { getTokenSilently } = useAuth();

const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};

const {
  searchQuery,
  cases,
  currentCase,
  activeCase,
  activeId,
  state,
  imageState,
  imageUrl,
  imageFile,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.case);

const currentImageUrl = computed(
  () => imageUrl.value || currentCase.value?.image
);

const handleSearch = async () => {
  const token = await getTokenSilently();
  await stores.case.update(token);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.case.update(token);
});
</script>
