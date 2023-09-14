<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="h-12 rounded-lg bg-lime-600 px-8 py-3 text-white hover:bg-lime-700"
    >
      AI生成關鍵字
    </CardButton>
    <CardButton
      class="h-12 rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click="handleSaveClick"
    >
      儲存關鍵字
    </CardButton>
    <CardButton
      class="h-12 rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white hover:bg-opacity-50"
    >
      使用說明
    </CardButton>
    <CardButton
      class="h-12 rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white hover:bg-opacity-50"
      @click="() => stores.modal.close()"
    >
      關閉
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import { Keyword, NewKeywordSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};
const {
  activeCase,
  activeId,
  newKeywords,
  currentKeywords,
  activeKeywords,
  loading,
} = storeToRefs(stores.case);

const createNewKeywords = async () => {
  if (newKeywords.value.length < 1) {
    console.log('no new keywords');
    return;
  }

  const kws = z.array(NewKeywordSchema).parse(newKeywords.value);
  const token = await getTokenSilently();

  console.log('Creating: ', kws);
  const { data } = await fetchResources<Keyword>(
    token,
    `/api/cases/${activeId.value}/keywords`,
    {
      method: 'post',
      body: { keywords: kws },
    }
  );

  console.log('Created: ', data);
  currentKeywords.value.unshift(...data);
  activeCase.value?.keywords.unshift(...data);
  newKeywords.value = [];
  return data;
};

// TODO
const editKeywords = async (editedKeywords: Keyword[]) => {
  if (editedKeywords.length < 1) {
    console.log('no edited keywords');
    return;
  }

  // const kws = z.array(NewKeywordSchema.passthrough()).parse(editedKeywords);
  // const token = await getTokenSilently();

  // console.log('Patching: ', kws);
  // const { data } = await fetchResources<Keyword>(token, `/api/keywords`, {
  //   method: 'put',
  //   body: { editedKeywords: kws.map((kw) => ({ id: kw._id, body: kw.body })) },
  // });

  // console.log('Patched: ', data);
  // currentKeywords.value.unshift(...data);
  // activeCase.value?.keywords.unshift(...data);
  // newKeywords.value = [];
  // return data;
};

// TODO
const removeKeywords = async (ids: string[]) => {
  const token = await getTokenSilently();

  console.log('Removing: ', ids);
};

const handleSaveClick = async (e: Event) => {
  try {
    loading.value = true;

    const editedKeywords: Keyword[] = [];
    const removedKeywordIds: string[] = [];

    for (const activeKeyword of activeKeywords.value) {
      const currentKeyword = currentKeywords.value.find(
        (kw) => kw._id === activeKeyword._id
      );

      if (currentKeyword) {
        editedKeywords.push({ ...currentKeyword });
      } else {
        removedKeywordIds.push(activeKeyword._id);
      }
    }

    await Promise.all([
      createNewKeywords(),
      editKeywords(editedKeywords),
      removeKeywords(removedKeywordIds),
    ]);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
