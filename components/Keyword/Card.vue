<template>
  <div
    @mousedown="handleMouseDown"
    @dragstart="() => (dragged = keyword)"
    :draggable="allowDrag && draggable"
    :class="draggable && 'cursor-move'"
    class="flex h-40 flex-col gap-2 rounded-lg bg-white px-4 py-5"
  >
    <div class="w-fit rounded-2xl bg-slate-400 px-3 py-1 text-sm text-white">
      {{ keyword.category || '未分類' }}
    </div>
    <input
      @dblclick="handleDblclick"
      @keypress.enter="(e) => handleEnterPress(e, keyword)"
      ref="inputRef"
      :readonly="!editing"
      :value="keyword.body"
      :class="!editing && 'focus:outline-none'"
      class="w-full p-2 text-2xl font-bold text-primary-500"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { Keyword } from '@/types/keyword';

interface Props {
  keyword: Keyword;
  draggable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  draggable: false,
});

const emit = defineEmits<{
  (e: 'update:keyword', k: Keyword): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const editing = ref(false);

const issueStore = useIssueStore();
const dragStore = useDragStore();
const allowDrag = ref(true);
const { dragged } = storeToRefs(dragStore);

const handleMouseDown = (e: MouseEvent) => {
  if (inputRef.value && inputRef.value === e.target) {
    allowDrag.value = false;
  } else {
    allowDrag.value = true;
  }
};

const handleOutsideClick = (e: MouseEvent) => {
  if (inputRef.value && !inputRef.value.contains(e.target as Node)) {
    editing.value = false;
    window.removeEventListener('click', handleOutsideClick);
  }
};

const handleDblclick = (e: MouseEvent) => {
  editing.value = true;
  window.addEventListener('click', handleOutsideClick);
};

const handleEnterPress = (e: KeyboardEvent, k: Keyword) => {
  if (!inputRef.value) {
    return;
  }

  editing.value = false;
  issueStore.updateKeywordById(k.id, { ...k, body: inputRef.value.value });
};
</script>
