<template>
  <div class="rounded-lg bg-white px-[15px] py-5 shadow-lg">
    <div class="flex flex-wrap items-center gap-2">
      <div v-if="$slots.favIcon">
        <slot name="favIcon" />
      </div>
      <div
        v-if="$slots.category"
        class="w-fit rounded-2xl bg-black px-3 py-1 text-sm font-medium leading-snug text-white"
      >
        <slot name="category" />
      </div>
      <div
        v-else
        class="w-fit rounded-2xl bg-black bg-opacity-40 px-3 py-1 text-sm font-medium leading-snug text-white"
      >
        未分類
      </div>
      <div
        @dblclick="handleDblclick"
        @keypress.enter.prevent="
          (e: KeyboardEvent) =>
            updateKeyword((e.target as HTMLDivElement).innerText)
        "
        :contenteditable="editing"
        class="basis-[90%] border-none bg-green-100 p-2 text-2xl font-bold text-lime-500"
      >
        <slot />
      </div>
    </div>
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
