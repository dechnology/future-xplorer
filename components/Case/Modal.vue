<template>
  <dialog
    v-if="activeCase"
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
    @click="(e) => onBackdropClick(e, stores.modal.close)"
  >
    <div class="flex h-full">
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
              <span class="text-base font-semibold text-gray-700">
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
        <KeywordGalleryPanel :include-search-bar="true">
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
                  @click="() => removeKeyword(el)"
                />
              </template>
            </KeywordCard>
          </KeywordGallery>
        </KeywordGalleryPanel>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
import { Keyword, KeywordQuery, NewKeywordSchema } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activeCase, activeId, loading } = storeToRefs(stores.case);

const { ignoreNextClose } = storeToRefs(stores.modal);

const modal = ref<HTMLDialogElement | null>(null);
const updateSignal = ref(false);

const keywordQuery = computed<KeywordQuery>(() => ({
  caseId: activeId.value,
  userId: undefined,
  category: undefined,
}));

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});

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
