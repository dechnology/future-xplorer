<template>
  <div
    @dragover.prevent
    @drop="handleDrop"
    class="grid content-start gap-2"
    :class="`grid-cols-${n_cols}`"
  >
    <KeywordIconCard
      v-if="includeAddCard"
      class="h-28"
      :icon="{ name: 'mdi:plus', size: '7.5rem' }"
    />
    <CaseModalKeywordCard
      v-for="k in filteredKeywords"
      class="h-28"
      :keyword="k"
      :key="k._id"
      :draggable="draggable"
      :show-category="showCategory"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  n_cols?: number;
  draggable?: boolean;
  includeAddCard?: boolean;
  showCategory?: boolean;
  categoryFilter?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  n_cols: 1,
  draggable: false,
  includeAddCard: false,
  showCategory: true,
});

const keywordStore = useKeywordStore();
const dragStore = useDragStore();
const { allKeywords } = storeToRefs(keywordStore);
const { dragged } = storeToRefs(dragStore);

const filteredKeywords = computed(() =>
  props.categoryFilter
    ? allKeywords.value.filter(
        (k) => 'category' in k && k.category === props.categoryFilter
      )
    : allKeywords.value
);

const handleDrop = (e: DragEvent) => {
  if (!props.categoryFilter) {
    return;
  }

  if (!dragged.value) {
    console.log('no dragging keywords');
    return;
  }

  dragged.value.category = props.categoryFilter;
};
</script>
