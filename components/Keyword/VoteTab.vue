<template>
  <NuxtLayout :left-basis="`${200 / 3}%`" :right-basis="`${100 / 3}%`">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
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
    <KeywordGalleryPanel :include-search-bar="true" @search="handleSearch">
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
const updateSignal = ref(false);
const searchQuery = ref();

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

const handleSearch = (query: string) => {
  searchQuery.value = query;
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.keyword.init(token);
});
</script>
