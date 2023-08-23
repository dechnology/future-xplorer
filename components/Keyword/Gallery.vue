<template>
  <div
    @dragover.prevent
    @drop="handleDrop"
    class="grid content-start gap-2"
    :class="`grid-cols-${n_cols}`"
  >
    <KeywordCard
      v-for="k in filteredKeywords"
      :keyword="k"
      :key="k.id"
      :draggable="draggable"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

interface Props {
  n_cols: number;
  draggable: boolean;
  categoryFilter?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  n_cols: 1,
  draggable: false,
});

const issueStore = useIssueStore();
const dragStore = useDragStore();
const { keywords } = storeToRefs(issueStore);
const { dragged } = storeToRefs(dragStore);

const filteredKeywords = computed(() =>
  props.categoryFilter
    ? keywords.value.filter((k) => k.category === props.categoryFilter)
    : keywords.value
);

const handleDrop = (e: DragEvent) => {
  if (!dragged.value) {
    console.log('no dragging keywords');
    return;
  }

  dragged.value.category = props.categoryFilter;
};
</script>
