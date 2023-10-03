<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="h-12 rounded-lg bg-lime-600 px-8 py-3 text-white hover:bg-lime-700"
      @click="HandleKeywordsGeneration"
    >
      AI生成關鍵字
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
import type { Keyword } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
  modal: useModalStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { activeCase, activeId, currentKeywords, loading } = storeToRefs(
  stores.case
);

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

    console.log('Creating: ', keywords);
    const { data } = await fetchResources<Keyword>(
      token,
      `/api/cases/${activeId.value}/keywords`,
      {
        method: 'post',
        body: { keywords },
      }
    );

    console.log('Created: ', data);
    currentKeywords.value = [...currentKeywords.value, ...data];
  } catch (e) {
    console.error(e);
  }
};
</script>
