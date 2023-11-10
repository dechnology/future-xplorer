<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      class="rounded-lg bg-lime-600 text-white hover:bg-lime-700"
      @click.prevent="() => stores.modal.close()"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
      @click.prevent="() => $emit('confirm')"
    >
      確認
    </CardButton>
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 text-white hover:bg-opacity-50"
    >
      使用說明
    </CardButton>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'confirm'): void;
}>();

const stores = {
  modal: useModalStore(),
};
</script>
