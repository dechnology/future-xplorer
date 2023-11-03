<template>
  <div
    v-if="keywords.length > 0"
    class="grid min-h-0 shrink grow basis-auto grid-cols-2 content-start gap-2 overflow-y-auto p-2"
    :style="{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }"
  >
    <slot :keywords="keywords" />
  </div>
  <div v-else class="flex h-full items-center justify-center">
    <p
      class="text-lg font-medium text-black text-opacity-30 xl:text-2xl xl:font-bold"
    >
      尚未有關鍵字資料
    </p>
  </div>
</template>

<script setup lang="ts">
import { Keyword, KeywordQuery } from '~/types';

interface Props {
  gridCols?: number;
  updateSignal?: boolean;
  keywordQuery: KeywordQuery;
}
const props = withDefaults(defineProps<Props>(), {
  gridCols: 1,
  updateSignal: false,
});

const { getTokenSilently } = useAuth();

const keywords = ref<Keyword[]>([]);
const loading = ref(false);

const updateKeywords = async (q: KeywordQuery) => {
  console.log(q);

  try {
    loading.value = true;
    const { issueId, caseId, userId, category, searchQuery, voterId, voted } =
      q;

    if (!(issueId || caseId)) {
      throw new Error('issueId or caseId is required');
    }

    if (userId === null) {
      keywords.value = [];
      return;
    }

    const token = await getTokenSilently();
    const { data } = await fetchResources<Keyword>(token, '/api/keywords', {
      query: {
        issueId,
        caseId,
        userId,
        category: category === null ? 'null' : category,
        searchQuery,
        voterId,
        voted,
      },
    });

    keywords.value = data;
    console.log(data);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

watchDeep(
  () => ({ ...props }),
  async ({ keywordQuery: q }) => {
    await updateKeywords(q);
  }
);

onMounted(async () => {
  await updateKeywords(props.keywordQuery);
});
</script>
