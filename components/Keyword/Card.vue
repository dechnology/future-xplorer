<template>
  <div
    class="flex items-center gap-2 rounded-lg bg-white p-2 shadow-lg xl:px-4 xl:py-5"
    @dblclick="handleDblclick"
  >
    <div class="flex h-full grow flex-col gap-2">
      <div class="flex gap-1 xl:gap-2">
        <div v-if="$slots.favIcon">
          <slot name="favIcon" />
        </div>
        <div
          v-if="showCategory"
          :class="[
            'w-fit rounded-xl bg-black px-2 py-1 text-[10px] leading-snug  text-white xl:rounded-2xl xl:px-3 xl:text-sm xl:font-medium',
            $slots.category ? '' : 'bg-opacity-40 ',
          ]"
        >
          <slot name="category">未分類</slot>
        </div>
      </div>
      <div
        ref="inputDivRef"
        :contenteditable="editing"
        class="grow border-none p-1 font-medium text-lime-500 lg:text-lg xl:p-2 xl:text-2xl xl:font-bold"
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
interface Props {
  showCategory?: boolean;
  editable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showCategory: true,
  editable: true,
});

const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
}>();

const inputDivRef = ref<HTMLDivElement | null>(null);
const editing = ref(false);

const handleDblclick = () => {
  if (!props.editable) return;

  editing.value = true;
  inputDivRef.value?.focus();
};

const handleKeywordUpdate = (e: KeyboardEvent | FocusEvent) => {
  if (!props.editable) return;

  editing.value = false;
  emit('update:keyword', (e.target as HTMLDivElement).innerText);
};
</script>
