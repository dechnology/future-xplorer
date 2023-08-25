<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="h-12 rounded-lg bg-green-400 text-white hover:bg-green-500"
      :icon="{ name: 'mdi-forum-plus', size: '3rem' }"
      body="AI生成關鍵字"
    />
    <CardButton
      @click="handleSaveClick"
      class="h-12 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
      :icon="{ name: 'mdi-forum-plus', size: '3rem' }"
      body="儲存關鍵字"
    />
    <CardButton
      class="h-12 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi-forum-plus', size: '3rem' }"
      body="使用說明"
    />
    <CardButton
      @click="handleCloseClick"
      class="h-12 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
      :icon="{ name: 'mdi-forum-plus', size: '3rem' }"
      body="關閉"
    />
  </div>
</template>

<script setup lang="ts">
const { user, getTokenSilently } = await useAuth();
const modalStore = useModalStore();
const cardStore = useCaseCardStore();
const keywordStore = useKeywordStore();
const { activeId } = storeToRefs(cardStore);

const handleCloseClick = (e: Event) => modalStore.close();

const handleSaveClick = async (e: Event) => {
  try {
    if (!activeId.value) {
      throw new Error('no active case');
    }

    const token = await getTokenSilently();
    await keywordStore.save(token, activeId.value);
  } catch (e) {
    console.error(e);
  }
};
</script>
