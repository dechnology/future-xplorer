<template>
  <NuxtLayout left-basis="50%" right-basis="50%">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
            <template #tooltip>{{ tooltip }}</template>
          </PanelHeader>
        </template>
        <FormCard v-bind="formCardProps" :username="username">
          <template #body>
            <StoryTemplateFormBody v-if="state === 'NEW'" />
            <StoryDetailsFormBody
              v-else-if="state === 'DETAILS' || state === 'EDITING'"
            />
            <StoryMultipleFormBody v-else />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions>
            <!-- <Icon
              v-if="state === 'NEW' || state === 'EDITING'"
              class="h-5 w-5 cursor-pointer text-blue-950 xl:h-6 xl:w-6"
              name="game-icons:rolling-dices"
              @click="handleDiceClick"
            /> -->
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <InputSearchBar v-model="searchQuery" @search="handleSearch" />
      <CardGallery :grid-cols="3">
        <Card
          :active="!activeStories"
          class="min-h-[200px] xl:min-h-[350px]"
          @click="() => (activeStories = [])"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增故事
          </CardIcon>
        </Card>
        <Card
          v-for="el in stories"
          :key="el._id"
          class="min-h-[200px] xl:min-h-[350px]"
          :active="activeIds.includes(el._id)"
          @dblclick="() => handleDblclick()"
          @click="() => stores.story.toggleActiveStory(el)"
        >
          <CardTitle>{{ el.title }}</CardTitle>
          <CardDescription>{{ el.content }}</CardDescription>
          <CardFootnote>{{ `建立者：${el.creator.name}` }}</CardFootnote>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKey } from '@/types';

const ActionsComponents: Record<
  FormStateKey | 'MULTIPLE',
  ConcreteComponent | string
> = {
  NEW: resolveComponent('StoryNewActions'),
  DETAILS: resolveComponent('StoryDetailsActions'),
  EDITING: resolveComponent('StoryEditingActions'),
  MULTIPLE: resolveComponent('StoryMultipleActions'),
} as const;

const formPanelProps = {
  title: '情境故事',
  description:
    '第五步從一張張的情境故事(poems)中選擇一張或彙整出一張形成最終的未來情境文字描述(一句話)',
};
const tooltip = [
  'Case. 如何新增單一故事？',
  '1. 點擊右側故事卡牌中左上方的加(+)號卡牌，左側面板將會切換為「新增故事」模式',
  '2. 依序輸入故事的：標題、使用者(P)、物件(O)、環境(E)、訊息(M)、服務(S)，亦可直接選擇之前設計的模板將資訊帶入。選項來自於之前小組成員的投票結果。如果發現關鍵字不足，或是某些分類沒有關鍵字，可以隨時回到前面的步驟進行擴增',
  '3. 按下「AI組成故事」自動填充故事內容區塊，或是小組成員自行觀察上方元素進行撰寫',
  '4. 最後按下「新增」按鈕，就會出現在右方的模板卡牌中。',
  '',
  'Case. 如何新增某故事的變形？',
  '1. 點擊右側故事卡牌中某個故事，左側面板將會切換為「故事資訊」模式',
  '2. 按下「AI編輯故事」將自動產生新的故事卡牌放在右側卡牌區',
  '',
  'Case. 如何將多故事合併成一個新故事？',
  '1. 點擊右側故事卡牌中多個故事，左側面板將會切換為「故事多選」模式',
  '2. 按下「AI組合故事」將自動產生新的故事卡牌放在右側卡牌區',
  '',
  'Case. 如何刪除故事？',
  '當我們想刪除某個故事時，可以透過以下方式刪除：',
  '1. 控制游標在卡牌中移動，此時所在位置的故事卡牌會以不同顏色呈現',
  '2. 「單擊」故事卡牌，左側面板將會切換為「故事資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與故事相關的資訊，並進入新增故事模式',
  '',
  'Case. 如何進入下一個流程？',
  '下一步是使用此故事進行圖片產製，可以直接點擊上方的「圖片產製」，開始鍵入',
].join('\n');

const { username, getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  persona: usePersonaStore(),
  keyword: useKeywordStore(),
  poemsTemplate: usePoemsTemplateStore(),
  story: useStoryStore(),
};
const {
  searchQuery,
  stories,
  // currentContext,
  activeStories,
  activeIds,
  state,
  formCardProps,
} = storeToRefs(stores.story);

const handleDblclick = () => {
  stores.modal.show();
};

// const handleDiceClick = () => {
//   currentContext.value = stores.poemsTemplate.getRandomContext();
// };

const handleSearch = async () => {
  const token = await getTokenSilently();
  stores.story.update(token);
};

onMounted(async () => {
  let token = await getTokenSilently();
  await Promise.all([stores.persona.init(token), stores.keyword.init(token)]);

  token = await getTokenSilently();
  await stores.poemsTemplate.init(token);

  token = await getTokenSilently();
  await stores.story.init(token);
});
</script>
