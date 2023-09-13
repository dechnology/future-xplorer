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
              @click="() => (currentCategory = value)"
            >
              {{ name }}
            </KeywordCategoryTab>
          </KeywordCategoryTabWrapper>
          <div class="flex min-h-0 shrink grow basis-auto">
            <KeywordGalleryPanel input-classes="basis-1/2">
              <KeywordHeader> 我的關鍵字 </KeywordHeader>
              <KeywordGallery>
                <KeywordCard
                  v-for="kw in filteredSelfKeywords"
                  :key="kw._id"
                  class="h-40"
                  @update:keyword="(body) => (kw.body = body)"
                >
                  <template #favIcon>
                    <Icon
                      name="ic:round-star-border"
                      size="20px"
                      class="cursor-pointer"
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
                :options="keywordUsers.map((u) => ({ name: u.name, data: u }))"
              >
                {{ slotProps.selected.name }}的關鍵字
              </CustomSelect>
              <KeywordGallery>
                <KeywordCard
                  v-for="kw in filteredUserKeywords"
                  :key="kw._id"
                  class="h-40"
                  @update:keyword="(body) => (kw.body = body)"
                >
                  <template #favIcon>
                    <Icon
                      name="ic:round-star-border"
                      size="20px"
                      class="cursor-pointer"
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
      <KeywordHeader> 我的最愛 </KeywordHeader>
      <KeywordGallery>
        <KeywordCard
          v-for="kw in favoriteKeywords"
          :key="kw._id"
          class="h-32"
          @update:keyword="(body) => (kw.body = body)"
        >
          <template #favIcon>
            <Icon
              name="ic:round-star"
              size="20px"
              class="cursor-pointer"
              @click="() => cancelVote(kw)"
            />
          </template>
          <template v-if="kw.category" #category>{{ kw.category }}</template>
          {{ kw.body }}
        </KeywordCard>
      </KeywordGallery>
    </KeywordGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Keyword, User, Vote } from '@/types';

const formPanelProps = {
  title: '關鍵字分享',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const { user, userId, getTokenSilently } = useAuth();
const stores = { issue: useIssueStore(), keyword: useKeywordStore() };
const { elementsArray } = storeToRefs(stores.issue);
const {
  loading,
  favoriteKeywords,
  nonFavoriteKeywords,
  nonFavoriteSelfKeywords,
  keywordUsers,
} = storeToRefs(stores.keyword);

const categoryTabs = computed(() => [
  { name: '全部', value: null },
  { name: '未分類', value: undefined },
  ...elementsArray.value.map((el) => ({ name: el.name, value: el.name })),
]);

const currentUser = ref(keywordUsers.value[0]);
const currentCategory = ref<string | undefined | null>(null);

const filteredKeywords = computed(() =>
  currentCategory.value === null
    ? nonFavoriteKeywords.value
    : nonFavoriteKeywords.value.filter(
        (kw) => kw.category === currentCategory.value
      )
);
const filteredUserKeywords = computed(() =>
  filteredKeywords.value.filter(
    (kw) => kw.creator._id === currentUser.value._id
  )
);
const filteredSelfKeywords = computed(() =>
  currentCategory.value === null
    ? nonFavoriteSelfKeywords.value
    : nonFavoriteSelfKeywords.value.filter(
        (kw) => kw.category === currentCategory.value
      )
);

const vote = async (kw: Keyword) => {
  try {
    loading.value = true;

    const token = await getTokenSilently();
    console.log('Voting: ', kw.body);
    const { data: vote } = await fetchResource<Vote>(token, `/api/votes`, {
      query: { keyword: kw._id },
      method: 'post',
    });
    vote.keyword = kw;
    vote.creator = user.value as User;
    console.log('vote: ', vote);
    kw.votes.push(vote);
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
    const index = kw.votes.findIndex(
      (vote) => vote.creator._id === userId.value
    );
    kw.votes.splice(index, 1);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>