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
        <KeywordGallery :grid-cols="2">
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
  case: useCaseStore(),
  keyword: useKeywordStore(),
  modal: useModalStore(),
};

const { elementsArray } = storeToRefs(stores.issue);

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

const updateKeyword = async (
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
  await stores.case.update(token);
};

const handleDrop = async () => {
  try {
    loading.value = true;
    if (!(draggingKeyword.value && currentElement.value)) {
      console.log('no dragging keywords');
      return;
    }

    await updateKeyword({
      _id: draggingKeyword.value._id,
      body: draggingKeyword.value.body,
      category: currentElement.value.name,
      type: currentElement.value.type,
    });
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const removeCategory = async (el: Keyword) => {
  try {
    loading.value = true;
    await updateKeyword({
      _id: el._id,
      body: el.body,
      category: undefined,
      type: undefined,
    });
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
