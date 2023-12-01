<template>
  <NuxtLayout :left-basis="`${200 / 3}%`" :right-basis="`${100 / 3}%`">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
            <template #tooltip>{{ tooltip }}</template>
          </PanelHeader>
          <KeywordCategoryTabWrapper>
            <KeywordCategoryTab
              v-for="{ name, value } in categoryTabs"
              :key="`${name}_${value}`"
              :active="currentCategory === value"
              @click="() => setCategory(value)"
            >
              {{ name }}
            </KeywordCategoryTab>
            <KeywordCategoryTab
              class="ml-auto"
              @click="() => stores.modal.show()"
            >
              <Icon name="mdi:plus" size="2rem" />
            </KeywordCategoryTab>
          </KeywordCategoryTabWrapper>
          <div class="flex min-h-0 shrink grow basis-auto">
            <KeywordGalleryPanel input-classes="basis-1/2">
              <KeywordHeader> 我的關鍵字 </KeywordHeader>
              <KeywordGallery
                v-slot="slotProps"
                :update-signal="updateSignal"
                :keyword-query="{ ...keywordQuery, userId }"
              >
                <KeywordCard
                  v-for="kw in slotProps.keywords"
                  :key="kw._id"
                  :editable="false"
                  class="min-h-20 xl:min-h-40"
                  @update:keyword="(body) => (kw.body = body)"
                >
                  <template #favIcon>
                    <Icon
                      name="ic:round-star-border"
                      class="cursor-pointer xl:h-5 xl:w-5"
                      @click="() => vote(kw)"
                    />
                  </template>
                  <template v-if="kw.category" #category>
                    {{ kw.category }}
                  </template>
                  {{ kw.body }}
                </KeywordCard>
              </KeywordGallery>
            </KeywordGalleryPanel>
            <KeywordGalleryPanel input-classes="basis-1/2">
              <CustomSelect
                v-slot="slotProps"
                v-model="currentUser"
                class="px-2"
                :options="
                  keywordUsers
                    .filter((u) => u._id !== userId)
                    .map((u) => ({ name: u.name, data: u }))
                "
              >
                <span v-if="slotProps.selected">
                  {{ slotProps.selected.name }}的關鍵字
                </span>
                <span v-else>選擇參與者</span>
              </CustomSelect>
              <KeywordGallery
                v-slot="slotProps"
                :update-signal="updateSignal"
                :keyword-query="keywordQuery"
              >
                <KeywordCard
                  v-for="kw in slotProps.keywords"
                  :key="kw._id"
                  :editable="false"
                  class="min-h-20 xl:min-h-40"
                  @update:keyword="(body) => (kw.body = body)"
                >
                  <template #favIcon>
                    <Icon
                      name="ic:round-star-border"
                      class="cursor-pointer xl:h-5 xl:w-5"
                      @click="() => vote(kw)"
                    />
                  </template>
                  <template v-if="kw.category" #category>
                    {{ kw.category }}
                  </template>
                  {{ kw.body }}
                </KeywordCard>
              </KeywordGallery>
            </KeywordGalleryPanel>
          </div>
        </template>
      </FormPanel>
    </template>
    <KeywordGalleryPanel>
      <InputSearchBar
        v-model="searchQueryBuffer"
        @search="searchQuery = searchQueryBuffer"
      />
      <KeywordHeader> 我的最愛 </KeywordHeader>
      <KeywordGallery
        v-slot="slotProps"
        :update-signal="updateSignal"
        :keyword-query="{
          ...keywordQuery,
          searchQuery: searchQuery,
          category: undefined,
          userId: undefined,
          voted: true,
        }"
      >
        <KeywordCard
          v-for="kw in slotProps.keywords"
          :key="kw._id"
          :editable="false"
          class="xl:h-32"
        >
          <template #favIcon>
            <Icon
              name="ic:round-star"
              class="cursor-pointer xl:h-5 xl:w-5"
              @click="() => cancelVote(kw)"
            />
          </template>
          <template v-if="kw.category" #category>{{ kw.category }}</template>
          {{ kw.body }}
        </KeywordCard>
      </KeywordGallery>
    </KeywordGalleryPanel>
    <KeywordCategoryModal />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Keyword, KeywordQuery, User, Vote } from '@/types';

const stroageKey = 'vote category';

const formPanelProps = {
  title: '關鍵字分享',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};
const tooltip = [
  'Case. 如何對關鍵字投票？',
  '- 透過點擊上方分類，可以對關鍵字進行分類展示，方便投票決策',
  '- 點擊「空心星星」即可把關鍵字卡牌從左移到右側我的最愛進行投票，可以對自己的關鍵字和別人的關鍵字投票',
  '',
  'Case. 是否可以取消投票？',
  '可以，直接按下右側關鍵字卡牌的「實心星星」即可撤銷，該關鍵卡牌就會回到左側的待投票區',
  '',
  'Case. 在這裡才發現關鍵字給的不完美，可否調整？',
  '可以，不論是已投票或是未投票的關鍵字，都可先藉由「雙擊」直接開啟關鍵字編輯模式，再單擊關鍵字進行修正',
  '',
  'Case. 如何進入下一個流程？',
  '等到大家都把關鍵字投票完畢後，下一步是大家一起對關鍵字設計POEMS組合（也稱為模板），可以直接點擊上方的「模板設計」，開始進行組合',
].join('\n');

const { userId, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  keyword: useKeywordStore(),
  modal: useModalStore(),
};
const { issueId, elementsArray } = storeToRefs(stores.issue);
const { loading, keywordUsers } = storeToRefs(stores.keyword);

const categoryTabs = computed(() => [
  { name: '全部', value: undefined },
  { name: '未分類', value: null },
  ...elementsArray.value.map((el) => ({ name: el.name, value: el.name })),
]);

const getCurrentCategory = () => {
  try {
    const categoryData = readLocalStorage(voteStorageKey);

    return (
      categoryData &&
      categoryTabs.value.find((el) => el.name === categoryData)?.name
    );
  } catch (e) {
    console.error(e);
  }
};

const currentUser = ref<User>();
const currentCategory = ref<string | undefined | null>(getCurrentCategory());
const searchQuery = ref('');
const searchQueryBuffer = ref('');
const updateSignal = ref(false);

const keywordQuery = computed<KeywordQuery>(() => ({
  issueId: issueId.value,
  category: currentCategory.value,
  userId: currentUser.value?._id || null,
  voterId: userId.value,
  voted: false,
}));

const vote = async (kw: Keyword) => {
  try {
    loading.value = true;

    const token = await getTokenSilently();
    console.log('Voting: ', kw.body);
    const { data } = await fetchResource<Vote>(token, `/api/votes`, {
      query: { keyword: kw._id },
      method: 'post',
    });
    console.log('Voted: ', data);

    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const cancelVote = async (kw: Keyword) => {
  try {
    loading.value = true;

    const token = await getTokenSilently();
    console.log('Voting: ', kw.body);
    const { message } = await fetchResource(token, `/api/votes`, {
      query: { keyword: kw._id },
      method: 'delete',
      deserializer: null,
    });
    console.log('message: ', message);

    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const setCategory = (cat: string | undefined | null) => {
  currentCategory.value = cat;

  if (cat === undefined) {
    localStorage.removeItem(stroageKey);
  } else if (cat === null) {
    localStorage.setItem(stroageKey, 'null');
  } else {
    localStorage.setItem(stroageKey, cat);
  }
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.keyword.init(token);
});
</script>
