<template>
  <dialog
    @click="handleBackdropClick"
    v-if="activeCase"
    ref="modal"
    class="h-5/6 w-11/12 rounded-2xl border-gray-300 p-16 focus:outline-slate-300"
  >
    <div class="flex h-full">
      <div class="flex h-full basis-1/2 flex-col gap-7">
        <slot />
      </div>
      <div class="basis-1/2">
        <slot name="keywords" />
        <!-- <KeywordModalPanel /> -->
      </div>
    </div>
  </dialog>
</template>

<script setup lang="ts">
const modal = ref<HTMLDialogElement | null>(null);
const stores = {
  modal: useModalStore(),
  case: useCaseStore(),
};
const { shown } = storeToRefs(stores.modal);
const { activeCase } = storeToRefs(stores.case);

const handleBackdropClick = (e: MouseEvent) => {
  const { x, y } = e;
  const { left, right, top, bottom } = (
    e.target as HTMLDialogElement
  ).getBoundingClientRect();

  // console.log('e.target: ', e.target);
  // console.log(`(x, y) = (${x}, ${y})`);
  // console.log(
  //   `(left, right, top, bottom) = (${left}, ${right}, ${top}, ${bottom})`
  // );
  // console.log(x < left, x > right, y < top, y > bottom);

  if (x < left || x > right || y < top || y > bottom) {
    stores.modal.close();
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
