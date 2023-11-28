<template>
  <div v-if="activeCase" class="flex h-full">
    <div class="flex h-full basis-1/2 flex-col gap-7">
      <CardHeader
        :title="activeCase.title"
        :creator-name="activeCase.creator.name"
      />
      <CaseModalContent
        v-slot="slotProps"
        @keyword-creation="updateSignal = !updateSignal"
      >
        <div
          v-for="(content, title) in slotProps.content"
          :key="`${content}_${title}`"
        >
          <p>
            <span
              class="text-sm font-medium text-gray-700 xl:text-base xl:font-semibold"
            >
              {{ title }}：
            </span>
            <span>
              {{ content }}
            </span>
          </p>
        </div>
      </CaseModalContent>
      <CaseModalActions @ai-generation="updateSignal = !updateSignal" />
    </div>
    <div class="basis-1/2">
      <KeywordGalleryPanel :include-search-bar="true" @search="handleSearch">
        <KeywordGallery
          v-slot="slotProps"
          :update-signal="updateSignal"
          :keyword-query="keywordQuery"
          :grid-cols="2"
        >
          <KeywordAddCard @add-keyword="createKeyword" />
          <KeywordCard
            v-for="(el, idx) in slotProps.keywords"
            :key="`${idx}_${el.body}`"
            @update:keyword="(body) => updateKeyword({ ...el, body })"
          >
            <template v-if="'category' in el && el.category" #category>
              <span>
                {{ el.category }}
              </span>
            </template>
            {{ el.body }}
            <template #removeIcon>
              <Icon
                name="mdi:bin"
                size="20px"
                class="cursor-pointer text-red-400 transition-all hover:text-red-600"
                @click="() => handleRemoveClick(el)"
              />
            </template>
          </KeywordCard>
        </KeywordGallery>
      </KeywordGalleryPanel>
    </div>
  </div>
  <ConfirmationModal
    :loading="loading"
    :signal="modalSignal"
    @confirm="handelConfirm"
  />
</template>

<script setup lang="ts">
import { Keyword, KeywordQuery, NewKeywordSchema } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { activeCase, activeId, loading } = storeToRefs(stores.case);

const { ignoreNextClose } = storeToRefs(stores.modal);

const searchQuery = ref();
const updateSignal = ref(false);

const modalSignal = ref(false);
const keywordToRemove = ref<Keyword | null>(null);

const handleRemoveClick = (kw: Keyword) => {
  keywordToRemove.value = kw;
  ignoreNextClose.value = true;
  modalSignal.value = !modalSignal.value;
};

const handelConfirm = async (status: boolean) => {
  if (status && keywordToRemove.value) {
    await removeKeyword(keywordToRemove.value);
    keywordToRemove.value = null;
  }
  modalSignal.value = !modalSignal.value;
};

const keywordQuery = computed<KeywordQuery>(() => ({
  caseId: activeId.value,
  userId: undefined,
  searchQuery: searchQuery.value,
  category: undefined,
}));

const handleSearch = (value: string) => {
  searchQuery.value = value;
};

const createKeyword = async (body: string) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;

    if (!activeId.value) {
      throw new Error('No active case');
    }

    const el = NewKeywordSchema.parse({ body });

    const token = await getTokenSilently();
    const { data } = await fetchResources<Keyword>(
      token,
      `/api/cases/${activeId.value}/keywords`,
      {
        method: 'post',
        body: { keywords: [el] },
      }
    );
    console.log('Created: ', data);

    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const removeKeyword = async (kw: Keyword) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;

    const token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'delete',
      }
    );
    console.log('Deleted: ', data);

    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const updateKeyword = async (kw: Keyword) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;

    const token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'put',
        body: kw,
      }
    );
    console.log('Updated: ', data);

    updateSignal.value = !updateSignal.value;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
