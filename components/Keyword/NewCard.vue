<template>
  <div
    class="flex flex-col items-start justify-start gap-2 rounded-lg bg-white px-4 py-5 shadow-2xl"
  >
    <input
      @dblclick="handleDblclick"
      @keypress.enter="(e) => {}"
      ref="inputRef"
      :readonly="!editing"
      :value="keyword.body"
      :class="!editing && 'focus:outline-none'"
      class="w-full border-none p-2 text-2xl font-bold text-lime-500"
    />
  </div>
</template>

<script setup lang="ts">
import { NewKeyword } from '@/types';

interface Props {
  keyword: NewKeyword;
}

const props = defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);
const editing = ref(false);

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

const updateKeyword = (k: NewKeyword) => {
  if (!inputRef.value) {
    return;
  }

  editing.value = false;
  // keywordStore.updateNewKeyword({ ...k, body: inputRef.value.value });
};
</script>
