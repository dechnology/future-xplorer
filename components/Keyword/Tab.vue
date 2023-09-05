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
            :draggable="true"
            v-for="k in keywords"
            @update:keyword="(body) => (k.body = body)"
            @dragstart="() => (draggingKeyword = k)"
            class="h-40"
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
          @click="() => (currentCategory = el)"
          :active="currentCategory === el"
        >
          {{ el }}
        </KeywordCategoryTab>
        <!-- TODO add button to create new category -->
        <!-- <KeywordCategoryTab class="ml-auto">
          <Icon name="mdi:plus" size="2rem" />
        </KeywordCategoryTab> -->
      </KeywordCategoryTabWrapper>
      <KeywordGallery @dragover.prevent @drop="handleDrop">
        <KeywordCard
          v-for="k in filteredKeywords"
          @update:keyword="(body) => (k.body = body)"
          class="h-32"
        >
          <template #category>{{ k.category }}</template>
          {{ k.body }}
        </KeywordCard>
      </KeywordGallery>
    </KeywordGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Keyword } from 'types';

const formPanelProps = {
  title: '關鍵字整理',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const { getTokenSilently } = useAuth();

const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
  modal: useModalStore(),
};

const { elements, keywords } = storeToRefs(stores.issue);
const { loading } = storeToRefs(stores.case);

const draggingKeyword = ref<Keyword | null>(null);

const elementsArray = computed(() =>
  elements.value
    ? [
        ...elements.value.objects,
        ...elements.value.environments,
        ...elements.value.messages,
        ...elements.value.services,
      ]
    : []
);
const currentCategory = ref(elementsArray.value[0]);
const filteredKeywords = computed(() =>
  keywords.value
    ? keywords.value.filter((kw) => kw.category === currentCategory.value)
    : []
);

const handleDrop = async (e: DragEvent) => {
  try {
    loading.value = true;
    if (!draggingKeyword.value) {
      console.log('no dragging keywords');
      return;
    }

    draggingKeyword.value.category = currentCategory.value;

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
</script>
