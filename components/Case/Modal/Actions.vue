<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="h-12 rounded-lg bg-lime-600 text-white"
      :class="!loading && 'hover:bg-lime-700'"
      :disabled="loading"
      @click.prevent="HandleKeywordsGeneration"
    >
      AI生成關鍵字
    </CardButton>
    <CardButton
      class="h-12 rounded-lg bg-black bg-opacity-40 text-white"
      :class="!loading && 'hover:bg-opacity-50'"
      :disabled="loading"
    >
      使用說明
    </CardButton>
    <CardButton
      class="h-12 rounded-lg bg-black bg-opacity-40 text-white"
      :class="!loading && 'hover:bg-opacity-50'"
      :disabled="loading"
      @click.prevent="() => stores.modal.close()"
    >
      關閉
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { Keyword } from '@/types';

const emit = defineEmits<{
  (e: 'aiGeneration'): void;
}>();

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
  modal: useModalStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { activeCase, activeId, loading } = storeToRefs(stores.case);
const { ignoreNextClose } = storeToRefs(stores.modal);

const HandleKeywordsGeneration = async () => {
  try {
    ignoreNextClose.value = true;
    loading.value = true;

    if (!(workshop.value && issue.value && activeCase.value)) {
      throw new Error('no workshop, issue, or active case');
    }

    console.log('Generating keywords...');
    const token = await getTokenSilently();
    const { keywords } = await generateKeywords(token, {
      workshop: workshop.value,
      issue: issue.value,
      _case: activeCase.value,
    });

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

    emit('aiGeneration');
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
