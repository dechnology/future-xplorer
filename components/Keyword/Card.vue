<template>
  <div
    class="flex items-center gap-2 rounded-lg bg-white px-[15px] py-5 shadow-lg"
  >
    <div class="flex h-full grow flex-col gap-2">
      <div class="flex gap-2">
        <div v-if="$slots.favIcon">
          <slot name="favIcon" />
        </div>
        <div
        :class="[
          'w-fit rounded-2xl bg-black px-3 py-1 text-sm font-medium leading-snug text-white',
          $slots.category ? '' : 'bg-opacity-40 '
        ]"
        >
          <slot name="category">未分類</slot>
        </div>
      </div>
      <div
        :contenteditable="editing"
        class="grow border-none bg-green-100 p-2 text-2xl font-bold text-lime-500"
        @keypress.enter.prevent="
          (e: KeyboardEvent) =>
            updateKeyword((e.target as HTMLDivElement).innerText)
        "
        @dblclick="handleDblclick"
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
const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
}>();

const editing = ref(false);

const handleDblclick = () => {
  editing.value = true;
};

const updateKeyword = (body: string) => {
  editing.value = false;
  emit('update:keyword', body);
};
</script>
