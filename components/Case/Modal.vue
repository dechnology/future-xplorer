<template>
  <dialog
    @click="handleBackdropClick"
    v-if="activeCase"
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
  >
    <div class="flex h-full">
      <div class="flex h-full basis-1/2 flex-col gap-7">
        <CardHeader :title="activeCase.title" :creator="activeCase.creator" />
        <CaseModalContent />
        <CaseModalActions />
      </div>
      <div class="basis-1/2">
        <KeywordModalPanel />
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const modalStore = useModalStore();
const cardStore = useCaseCardStore();
const { shown } = storeToRefs(modalStore);
const { activeCase } = storeToRefs(cardStore);
const modal = ref<HTMLDialogElement | null>(null);

const handleBackdropClick = (e: MouseEvent) => {
  const { x, y } = e;
  const { left, right, top, bottom } = (
    e.target as HTMLDialogElement
  ).getBoundingClientRect();

  console.log('e.target: ', e.target);
  console.log(`(x, y) = (${x}, ${y})`);
  console.log(
    `(left, right, top, bottom) = (${left}, ${right}, ${top}, ${bottom})`
  );
  console.log(x < left, x > right, y < top, y > bottom);

  if (x < left || x > right || y < top || y > bottom) {
    console.log('backdrop clicked');

    modalStore.close();
  }
};

watch(shown, (newShown) => {
  console.log('shown: ', shown.value);

  if (newShown) {
    modal.value?.showModal();
    return;
  }
  modal.value?.close();
});
</script>
