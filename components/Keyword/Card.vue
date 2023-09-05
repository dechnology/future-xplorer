<template>
  <div
    class="flex flex-col items-start justify-start gap-2 rounded-lg bg-white px-[15px] py-5 shadow-lg"
  >
    <div
      v-if="$slots.category"
      class="w-fit rounded-2xl bg-black bg-opacity-40 px-3 py-1 text-sm font-medium leading-snug text-white"
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
const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
}>();

const editing = ref(false);

const handleDblclick = (e: MouseEvent) => {
  editing.value = true;
};

const updateKeyword = (body: string) => {
  editing.value = false;
  emit('update:keyword', body);
};
</script>
