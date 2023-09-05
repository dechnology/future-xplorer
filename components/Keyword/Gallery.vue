<template>
  <div
    @dragover.prevent
    @drop="handleDrop"
    class="grid min-h-0 shrink grow basis-auto grid-cols-2 content-start gap-2 overflow-y-auto p-2"
    :style="{ gridTemplateColumns: `repeat(${n_cols}, minmax(0, 1fr))` }"
  >
    <slot />
    <!-- <KeywordIconCard
      v-if="includeAddCard"
      class="h-28"
      :icon="{ name: 'mdi:plus', size: '7.5rem' }"
    />
    <KeywordNewCard
      v-for="k in newKeywords"
      class="h-28"
      :keyword="k"
      :key="k.body"
    />
    <KeywordCard
      v-for="k in filteredKeywords"
      class="h-28"
      :keyword="k"
      :key="k._id"
      :draggable="draggable"
      :show-category="showCategory"
    /> -->
  </div>
</template>

<script setup lang="ts">
interface Props {
  n_cols?: number;
  draggable?: boolean;
  includeAddCard?: boolean;
  includeNewKeywords?: boolean;
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
const { keywords, newKeywords } = storeToRefs(keywordStore);
const { dragged } = storeToRefs(dragStore);

const filteredKeywords = computed(() =>
  props.categoryFilter
    ? keywords.value.filter(
        (k) => 'category' in k && k.category === props.categoryFilter
      )
    : keywords.value
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
