<template>
  <div
    @mousedown="handleMouseDown"
    class="flex flex-col items-start justify-start gap-2 rounded-lg bg-white px-4 py-5 shadow-lg"
  >
    <div
      v-if="$slots.category"
      class="w-fit rounded-2xl bg-slate-400 px-3 py-1 text-sm text-white"
    >
      <slot name="category" />
    </div>
    <div
      @dblclick="handleDblclick"
      @keypress.enter.prevent="
        (e: KeyboardEvent) =>
          updateKeyword((e.target as HTMLDivElement).innerText)
      "
      :contenteditable="editing"
      class="w-full border-none bg-green-100 p-2 text-2xl font-bold text-lime-500"
    >
      <slot />
    </div>
    <!-- <div
      v-if="showCategory"
      class="w-fit rounded-2xl bg-slate-400 px-3 py-1 text-sm text-white"
    >
      {{ keyword.category || '未分類' }}
    </div>
    <input
      @dblclick="handleDblclick"
      @keypress.enter="(e) => updateKeyword(keyword)"
      ref="inputRef"
      :readonly="!editing"
      :value="keyword.body"
      :class="!editing && 'focus:outline-none'"
      class="w-full border-none p-2 text-2xl font-bold text-lime-500"
    /> -->
  </div>
</template>

<script setup lang="ts">
import { Keyword } from '@/types';

// interface Props {
//   // showCategory: boolean;
// }

// const props = withDefaults(defineProps<Props>(), {
//   // draggable: false,
//   // showCategory: true,
// });

const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const editing = ref(false);

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

const updateKeyword = (body: string) => {
  editing.value = false;
  emit('update:keyword', body);
};
</script>
