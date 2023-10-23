<template>
  <div
    v-show="showNewKeywordBtn"
    @click.stop="handlelclick"
    class="flex items-center gap-2 rounded-lg bg-white px-[15px] py-5 shadow-lg"
  >
    <div class="flex h-full grow flex-col items-center justify-center gap-2">
      <div class="flex gap-2">
        <div>
        <div
          class="flex h-full flex-col items-center justify-center text-xl font-semibold text-neutral-500"
        >
          <Icon name='mdi:plus' size='2rem' />
            新增關鍵字
        </div>
        </div>
      </div>
    </div>
  </div>
  <div
    v-show="!showNewKeywordBtn"
    class="flex items-center gap-2 rounded-lg bg-white px-[15px] py-5 shadow-lg"
  >
    <div class="flex h-full grow flex-col gap-2">
      <div class="flex gap-2">
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
        @input="(e: Event) => syncPinia((e.target as HTMLDivElement).innerText)"
        @keypress.enter.prevent="
          (e: KeyboardEvent) =>
            updateKeyword((e.target as HTMLDivElement).innerText)
        "
        @dblclick="handleDblclick"
      >
      {{ keywordInput }}
      </div>
    </div>
    <div class="flex h-full flex-col justify-around">
      <Icon
                name="mdi:close-thick"
                size="20px"
                class="cursor-pointer text-red-400 transition-all hover:text-red-600"
                @click.stop="() => handleCancelBtnClick()"
              />
    </div>
  </div>
</template>

<script setup lang="ts">

const stores = {
  case: useCaseStore(),
};

const {
  keywordInput,
  showNewKeywordBtn,
} = storeToRefs(stores.case);

const editing = ref(true);

const emit = defineEmits<{
  (e: 'update:keyword', body: string): void;
  (e: 'cancel:keyword'): void;
}>();

const syncPinia = (body: string) => {
  console.log(body)
  keywordInput.value = body;
};

const updateKeyword = (body: string) => {
  editing.value = false;
  emit('update:keyword', body);
};

const handleDblclick = () => {
  editing.value = true;
};

const handlelclick = () => {
  showNewKeywordBtn.value = false;
};

const handleCancelBtnClick = () => {
  emit('cancel:keyword');
};
</script>
