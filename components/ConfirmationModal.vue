<template>
  <dialog
    ref="modal"
    class="h-1/3 w-1/2 rounded-2xl border-gray-300 p-4 focus:outline-slate-300 xl:p-16"
    @click="(e) => onBackdropClick(e, handleBackdropClick)"
  >
    <div class="flex h-full flex-col gap-4 overflow-y-auto xl:gap-8">
      <div class="flex flex-col gap-4">
        <h3 class="text-lg">確定要刪除嗎？</h3>
        <p class="text-sm text-gray-500">刪除後將無法復原，請確認是否刪除！</p>
      </div>
      <div class="mt-auto flex items-center justify-around">
        <CardButton
          class="rounded-lg bg-black bg-opacity-40 text-white transition-all"
          :class="!loading && 'hover:bg-opacity-50'"
          :disabled="loading"
          @click.prevent="() => confirm(false)"
        >
          取消
        </CardButton>
        <CardButton
          class="rounded-lg bg-red-400 text-white transition-all"
          :class="!loading && 'hover:bg-red-500'"
          :disabled="loading"
          @click.prevent="() => confirm(true)"
        >
          確認
        </CardButton>
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
interface Props {
  signal: boolean;
  loading: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{ (e: 'confirm', status: boolean): void }>();

const modal = ref<HTMLDialogElement | null>(null);
const ignoreNextClick = ref(false);

const handleBackdropClick = () => {
  if (ignoreNextClick.value) {
    ignoreNextClick.value = false;
    return;
  }

  toggleModal();
};

const confirm = (status: boolean) => {
  ignoreNextClick.value = true;
  emit('confirm', status);
};

const toggleModal = () => {
  if (!modal.value || props.loading) {
    return;
  }

  if (modal.value.open) {
    modal.value.close();
  } else {
    modal.value.showModal();
  }
};

watch(() => props.signal, toggleModal);
</script>
