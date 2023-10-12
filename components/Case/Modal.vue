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
        <CaseModalContent v-slot="slotProps">
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
        <CaseModalActions />
      </div>
      <div class="basis-1/2">
        <KeywordGalleryPanel v-slot="slotProps" :include-search-bar="true">
          <KeywordGallery :grid-cols="2">
            <KeywordCard
              v-for="(el, idx) in activeCase.keywords.filter((el) =>
                el.body.includes(slotProps.searchQuery)
              )"
              :key="`${idx}_${el.body}`"
              class="h-28"
              @update:keyword="(body) => updateKeyword({ ...el, body })"
            >
              <template #category>
                <span v-if="'category' in el && el.category">
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
import { Keyword } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activeCase, loading } = storeToRefs(stores.case);

const { ignoreNextClose } = storeToRefs(stores.modal);

const modal = ref<HTMLDialogElement | null>(null);

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});

const removeKeyword = async (kw: Keyword) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;

    let token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'delete',
      }
    );
    console.log('Deleted: ', data);

    token = await getTokenSilently();
    await stores.case.update(token);
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
    let token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'put',
        body: kw,
      }
    );
    console.log('Updated: ', data);

    token = await getTokenSilently();
    await stores.case.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
