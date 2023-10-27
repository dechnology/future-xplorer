<template>
  <div class="flex h-full flex-col gap-8">
    <CardGalleryPanel :include-search-bar="false">
      <CardGallery :grid-cols="5">
        <Card
          v-for="el in historyCases"
          :key="el._id"
          :active="activeId === el._id"
          class="h-[350px]"
          @dblclick="() => applyHistoryCase(el)"
        >
          <template #image>
            <CardImage :url="null" />
          </template>
          <CardDescription
            input-classes="text-zinc-800 text-sm font-medium leading-snug"
          >
            {{
              [
                `標題：${el.title}`,
                `目標：${el.goal}`,
                `作法：${el.method}`,
              ].join('\n')
            }}
          </CardDescription>
          <CardFootnote>
            {{ `參考資料：${el.reference}` }}
          </CardFootnote>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
    <div class="flex items-center justify-around">
      <CardButton
        class="h-12 rounded-lg bg-black bg-opacity-40 px-8 text-white transition-all"
        :class="!loading && 'hover:bg-opacity-50'"
        :disabled="loading"
      >
        <span class="py-3"> 使用說明 </span>
      </CardButton>
      <CardButton
        class="h-12 rounded-lg bg-black bg-opacity-40 px-8 text-white transition-all"
        :class="!loading && 'hover:bg-opacity-50'"
        :disabled="loading"
        @click.prevent="() => stores.modal.close()"
      >
        <span class="py-3"> 關閉 </span>
      </CardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HistoryCase } from '~/types';

const { getTokenSilently } = useAuth();

const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { currentCase, activeId, loading } = storeToRefs(stores.case);

const historyCases = ref<HistoryCase[]>([]);

const applyHistoryCase = (el: HistoryCase) => {
  const { title, background, method, goal, challenge, result, reference } = el;
  currentCase.value = {
    ...currentCase.value,
    title,
    background,
    method,
    goal,
    challenge,
    result,
    reference,
  };
  stores.modal.close();
};

onMounted(async () => {
  try {
    loading.value = true;
    const token = await getTokenSilently();
    historyCases.value = await fetchHistoryCases(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
