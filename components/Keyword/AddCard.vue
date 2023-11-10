<template>
  <div
    class="flex shrink-0 grow-0 items-center justify-center gap-2 rounded-lg bg-white shadow-lg"
  >
    <div
      v-if="editing"
      class="flex h-full grow items-center justify-center border-none p-5"
    >
      <input
        ref="inputRef"
        class="w-full rounded border-none text-2xl"
        type="text"
        @keypress.enter.prevent="
          (e: KeyboardEvent) => addKeyword((e.target as HTMLInputElement).value)
        "
        @focusout="() => (editing = false)"
      />
    </div>
    <div
      v-else
      class="flex h-full cursor-pointer items-center"
      @click="handleClick"
    >
      <Icon
        class="h-10 w-10 text-gray-400 lg:h-16 lg:w-16 xl:h-24 xl:w-24"
        name="mdi:plus"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'addKeyword', body: string): void;
}>();

const stores = {
  modal: useModalStore(),
};

const { ignoreNextClose } = storeToRefs(stores.modal);

const inputRef = ref<HTMLInputElement>();
const editing = ref(false);

const handleClick = async () => {
  ignoreNextClose.value = true;
  editing.value = true;

  await nextTick();
  if (!inputRef.value) return;
  inputRef.value.focus();
};

const addKeyword = (body: string) => {
  editing.value = false;
  emit('addKeyword', body);
};
</script>
