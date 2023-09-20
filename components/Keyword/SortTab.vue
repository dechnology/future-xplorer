<template>
  <NuxtLayout left-basis="50%" right-basis="50%">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
          </PanelHeader>
        </template>
        <KeywordGallery :n_cols="2">
          <KeywordCard
            v-for="k in selfKeywords.filter((k) => !k.category)"
            :key="k._id"
            :draggable="true"
            class="h-40"
            @update:keyword="(body) => (k.body = body)"
            @dragstart="() => (draggingKeyword = k)"
          >
            <template v-if="k.category" #category>{{ k.category }}</template>
            {{ k.body }}
          </KeywordCard>
        </KeywordGallery>
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
        <!-- TODO add button to create new category -->
        <!-- <KeywordCategoryTab class="ml-auto">
          <Icon name="mdi:plus" size="2rem" />
        </KeywordCategoryTab> -->
      </KeywordCategoryTabWrapper>
      <KeywordGallery @dragover.prevent @drop="handleDrop">
        <KeywordCard
          v-for="k in filteredKeywords"
          :key="k._id"
          class="h-32"
          @update:keyword="(body) => (k.body = body)"
        >
          <template #category>{{ k.category }}</template>
          {{ k.body }}
          <template #removeIcon>
            <Icon
              name="tabler:arrow-back-up"
              size="24px"
              class="cursor-pointer text-neutral-400 transition-all hover:text-neutral-600"
              @click="() => (k.category = undefined)"
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
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Keyword, WorkshopElement } from '@/types';

const formPanelProps = {
  title: '關鍵字整理',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const { getTokenSilently } = useAuth();

const stores = {
  issue: useIssueStore(),
  keyword: useKeywordStore(),
  modal: useModalStore(),
};

const { elementsArray } = storeToRefs(stores.issue);

const getCurrentElement = (
  defaultElement: WorkshopElement | undefined = elementsArray.value.at(0)
) => {
  try {
    const elementData = readLocalStorage(sortStorageKey);

    if (!elementData) {
      throw new Error('no cache');
    }

    return elementsArray.value.find((el) => el.name === elementData);
  } catch (e) {
    console.error(e);
    return defaultElement;
  }
};

const { selfKeywords, loading } = storeToRefs(stores.keyword);

const draggingKeyword = ref<Keyword | null>(null);
const currentElement = ref<WorkshopElement | undefined>(getCurrentElement());
const filteredKeywords = computed(() =>
  selfKeywords.value
    ? selfKeywords.value.filter(
        (kw) =>
          currentElement.value && kw.category === currentElement.value.name
      )
    : []
);

const handleDrop = async () => {
  try {
    loading.value = true;
    if (!(draggingKeyword.value && currentElement.value)) {
      console.log('no dragging keywords');
      return;
    }

    draggingKeyword.value.category = currentElement.value.name;
    draggingKeyword.value.type = currentElement.value.type;

    const token = await getTokenSilently();
    console.log('Patching: ', draggingKeyword);
    const { data: editedKeyword } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${draggingKeyword.value._id}`,
      {
        method: 'put',
        body: {
          body: draggingKeyword.value.body,
          category: draggingKeyword.value.category,
          type: draggingKeyword.value.type,
        },
      }
    );

    console.log('Patched: ', editedKeyword);
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
