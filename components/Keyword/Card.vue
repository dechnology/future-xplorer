<template>
  <div
    class="flex items-center gap-2 rounded-lg bg-white px-[15px] py-5 shadow-lg"
    @dblclick="handleDblclick"
  >
    <div class="flex h-full grow flex-col gap-2">
      <div class="flex gap-2">
        <div v-if="$slots.favIcon">
          <slot name="favIcon" />
        </div>
        <div
          v-if="showCategory"
          :class="[
            'w-fit rounded-2xl bg-black px-3 py-1 text-sm font-medium leading-snug text-white',
            $slots.category ? '' : 'bg-opacity-40 ',
          ]"
        >
          <slot name="category">未分類</slot>
        </div>
      </div>
      <div
        ref="inputDivRef"
        :contenteditable="editing"
        class="grow border-none p-2 text-2xl font-bold text-lime-500"
        @focusout="handleKeywordUpdate"
        @keypress.enter.prevent="handleKeywordUpdate"
      >
        <slot />
      </div>
    </div>
    <div class="flex h-full flex-col justify-around">
      <slot name="removeIcon" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    showCategory?: boolean;
  }>(),
  {
    showCategory: true,
  }
);

const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
}>();

const inputDivRef = ref<HTMLDivElement | null>(null);
const editing = ref(false);

const handleDblclick = () => {
  editing.value = true;
  inputDivRef.value?.focus();
};

const handleKeywordUpdate = (e: KeyboardEvent | FocusEvent) => {
  editing.value = false;
  emit('update:keyword', (e.target as HTMLDivElement).innerText);
};
</script>
