<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="h-12 rounded-lg bg-lime-600 px-8 py-3 text-white hover:bg-lime-700"
      @click="HandleKeywordsGeneration"
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
import type { DeleteResult } from 'mongodb';
import type { Keyword } from '@/types';
import { NewKeywordSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
  modal: useModalStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const {
  activeCase,
  activeId,
  newKeywords,
  currentKeywords,
  activeKeywords,
  loading,
} = storeToRefs(stores.case);

const HandleKeywordsGeneration = async () => {
  try {
    if (!(workshop.value && issue.value && activeCase.value)) {
      throw new Error('no workshop, issue, or active case');
    }

    const token = await getTokenSilently();

    console.log('Generating keywords...');
    const { keywords } = await generateKeywords(token, {
      workshop: workshop.value,
      issue: issue.value,
      _case: activeCase.value,
    });
    console.log('keywords: ', keywords);

    newKeywords.value.unshift(...keywords.map((kw) => ({ body: kw })));
  } catch (e) {
    console.error(e);
  }
};

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

const editKeywords = async (...editedKeywords: Keyword[]) => {
  try {
    if (editedKeywords.length < 1) {
      console.log('no edited keywords');
      return;
    }

    const token = await getTokenSilently();
    const kws = z.array(NewKeywordSchema.passthrough()).parse(editedKeywords);

    console.log('Patching: ', kws);
    const { data, error } = await useFetch(`/api/keywords`, {
      method: 'put',
      headers: { Authorization: `Bearer ${token}` },
      body: { updatedKeywords: kws },
    });

    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('data are null');
    }

    console.log('Patched: ', data.value);
  } catch (e) {
    console.error(e);
  }
};

const removeKeywordByIds = async (...ids: string[]) => {
  try {
    if (ids.length < 1) {
      console.log('no removed keywords');
      return;
    }

    const token = await getTokenSilently();

    console.log('Deleting: ', ids);
    const { data, error } = await useFetch(`/api/keywords`, {
      query: { ids: ids.join(',') },
      method: 'delete',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error.value) {
      throw error.value;
    }

    if (!data.value) {
      throw new Error('data are null');
    }

    console.log('Deleted: ', data.value);
  } catch (e) {
    console.error(e);
  }
};

const handleSaveClick = async () => {
  try {
    loading.value = true;

    const editedKeywords: Keyword[] = [];
    const removedKeywordIds: string[] = [];

    for (const activeKeyword of activeKeywords.value) {
      const currentKeyword = currentKeywords.value.find(
        (kw) => kw._id === activeKeyword._id
      );

      console.log(currentKeyword?.body);
      console.log(activeKeyword.body);

      if (!currentKeyword) {
        removedKeywordIds.push(activeKeyword._id);
      } else if (activeKeyword.body !== currentKeyword.body) {
        editedKeywords.push({ ...currentKeyword });
      }
    }

    // await Promise.all([
    //   createNewKeywords(),
    //   editKeywords(...editedKeywords),
    //   removeKeywordByIds(...removedKeywordIds),
    // ]);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
