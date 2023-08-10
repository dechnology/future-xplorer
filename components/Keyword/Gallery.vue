<template>
  <div
    @dragover.prevent
    @drop="handleDrop"
    class="grid content-start gap-2"
    :class="`grid-cols-${n_cols}`"
  >
    <div
      v-for="k in filteredKeywords"
      @dragstart="() => (dragged = k)"
      :key="k.id"
      :draggable="draggable"
      :class="draggable && 'cursor-move'"
      class="flex h-40 flex-col gap-2 rounded-lg bg-white px-4 py-5"
    >
      <div class="w-fit rounded-2xl bg-slate-400 px-3 py-1 text-sm text-white">
        {{ k.category || '未分類' }}
      </div>
      <h4 class="text-2xl font-bold text-primary-500">{{ k.body }}</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

interface Props {
  n_cols: number;
  draggable: boolean;
  categoryFilter?: string;
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
  keywords.value.filter((k) => k.category === props.categoryFilter)
);

const handleDrop = (e: DragEvent) => {
  if (!dragged.value) {
    console.log('no dragging keywords');
    return;
  }

  dragged.value.category = props.categoryFilter;
};
</script>
