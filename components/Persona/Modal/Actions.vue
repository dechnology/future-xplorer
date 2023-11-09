<template>
  <div class="flex justify-center">
    <CardButton
      class="rounded-lg bg-black bg-opacity-40 text-white hover:bg-opacity-50"
      @click="() => stores.modal.close()"
    >
      關閉
    </CardButton>
  </div>
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
};
</script>
