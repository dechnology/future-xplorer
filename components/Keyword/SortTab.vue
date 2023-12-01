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
        <KeywordGalleryPanel input-classes="px-0 pt-0">
          <InputSearchBar
            v-model="searchQueryBuffer"
            @search="searchQuery = searchQueryBuffer"
          />
          <KeywordGallery
            v-slot="slotProps"
            :update-signal="updateSignal"
            :keyword-query="{
              ...keywordQuery,
              category: undefined,
              searchQuery: searchQuery,
            }"
            :grid-cols="2"
          >
            <KeywordCard
              v-for="k in slotProps.keywords.filter((k) => !k.category)"
              :key="k._id"
              :draggable="true"
              class="xl:h-40"
              @update:keyword="(body) => (k.body = body)"
              @dragstart="() => (draggingKeyword = k)"
            >
              <template v-if="k.category" #category>{{ k.category }}</template>
              {{ k.body }}
            </KeywordCard>
          </KeywordGallery>
        </KeywordGalleryPanel>
      </FormPanel>
    </template>
    <KeywordGalleryPanel>
      <KeywordCategoryTabWrapper>
        <KeywordCategoryTab
          v-for="el in elementsArray"
          :key="`${el.type}_${el.name}`"
          :active="currentElement && currentElement.name === el.name"
          @click="() => setElement(el)"
        >
          {{ el.name }}
        </KeywordCategoryTab>
        <KeywordCategoryTab class="ml-auto" @click="() => stores.modal.show()">
          <Icon name="mdi:plus" size="2rem" />
        </KeywordCategoryTab>
      </KeywordCategoryTabWrapper>
      <KeywordGallery
        v-slot="slotProps"
        :update-signal="updateSignal"
        :keyword-query="keywordQuery"
        @dragover.prevent
        @drop="handleDrop"
      >
        <KeywordCard
          v-for="k in slotProps.keywords"
          :key="k._id"
          class="xl:h-32"
          @update:keyword="(body) => (k.body = body)"
        >
          <template #category>{{ k.category }}</template>
          {{ k.body }}
          <template #removeIcon>
            <Icon
              name="tabler:arrow-back-up"
              size="24px"
              class="cursor-pointer text-neutral-400 transition-all hover:text-neutral-600"
              @click="() => removeCategory(k)"
            />
            <!-- TODO -->
            <!-- <Icon
              name="mdi:bin"
              size="24px"
              class="cursor-pointer text-red-400 transition-all hover:text-red-600"
              @click="() => removeNewKeyword(idx)"
            /> -->
          </template>
        </KeywordCard>
      </KeywordGallery>
    </KeywordGalleryPanel>
    <KeywordCategoryModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Keyword, KeywordQuery, WorkshopElement } from '@/types';

const formPanelProps = {
  title: '關鍵字整理',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};
const tooltip = [
  'Case. 如何對關鍵字分類？',
  '1. 先在心中決定關鍵字的類別，然後點擊右側的類別',
  '2. 將左側的關鍵字卡牌按下滑鼠左鍵不放開（或是觸控板按住不放），將卡牌拖曳到右側的類別即完成分類',
  '',
  'Case. 是否可以重新分類關鍵字？',
  '1. 可以，直接按下右側已分類的關鍵字卡牌右側的撤銷鈕，該關鍵卡牌就會回到左側的未分類',
  '',
  'Case. 在這裡才發現關鍵字給的不完美，可否調整？',
  '1. 可以，不論是已分類或是未分類的關鍵字，都可先藉由「雙擊」直接開啟關鍵字編輯模式，再單擊關鍵字進行修正',
  '',
  'Case. 找不到適合類別怎麼辦？',
  '當我們想新增關鍵字分類時，可以透過以下方式修改：',
  '1. 點擊右半部分上方分類Tab的最右邊的「加(+)號」按鈕，此時會跳出與新建工作坊時的OEMS新增分類一樣的介面',
  '2. 在OEMS下輸入新的子分類名稱',
  '3. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何進入下一個流程？',
  '等到大家都把關鍵字分類完畢後，下一步是大家一起對關鍵字進行投票，可以直接點擊上方的「關鍵字分享」，開始整理',
].join('\n');

const { userId, getTokenSilently } = useAuth();

const stores = {
  issue: useIssueStore(),
  modal: useModalStore(),
};

const { issueId, elementsArray } = storeToRefs(stores.issue);

const getCurrentElement = (
  defaultElement: WorkshopElement | undefined = elementsArray.value.at(0)
) => {
  try {
    const elementData =
      readLocalStorage(sortStorageKey) || defaultElement?.name;

    return elementsArray.value.find((el) => el.name === elementData);
  } catch (e) {
    console.error(e);
    return defaultElement;
  }
};

const draggingKeyword = ref<Keyword | null>(null);
const currentElement = ref<WorkshopElement | undefined>(getCurrentElement());
const loading = ref(false);
const searchQuery = ref('');
const searchQueryBuffer = ref('');
const updateSignal = ref(false);

const keywordQuery = computed<KeywordQuery>(() => ({
  issueId: issueId.value,
  userId: userId.value,
  category: currentElement.value?.name,
}));

const patchKeyword = async (
  el: Pick<Keyword, '_id' | 'body' | 'category' | 'type'>
) => {
  const { _id, body, category, type } = el;

  let token = await getTokenSilently();
  console.log('Patching: ', el);
  const { data: editedKeyword } = await fetchResource<Keyword>(
    token,
    `/api/keywords/${_id}`,
    {
      method: 'put',
      body: { body, category: category || null, type: type || null },
    }
  );
  console.log('Patched: ', editedKeyword);

  token = await getTokenSilently();
};

const handleDrop = async () => {
  try {
    loading.value = true;
    if (!(draggingKeyword.value && currentElement.value)) {
      console.log('no dragging keywords');
      return;
    }

    await patchKeyword({
      _id: draggingKeyword.value._id,
      body: draggingKeyword.value.body,
      category: currentElement.value.name,
      type: currentElement.value.type,
    });
    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const removeCategory = async (el: Keyword) => {
  try {
    loading.value = true;
    await patchKeyword({
      _id: el._id,
      body: el.body,
      category: undefined,
      type: undefined,
    });
    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const setElement = (el: WorkshopElement) => {
  currentElement.value = el;
  localStorage.setItem(sortStorageKey, el.name);
};
</script>
