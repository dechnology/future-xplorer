<template>
  <div class="flex flex-wrap items-center justify-center gap-6">
    <CardButton
      @click="() => stores.modal.close()"
      class="h-12 rounded-lg bg-black bg-opacity-40 px-8 py-3 text-white hover:bg-opacity-50"
      body="關閉"
    />
  </div>
</template>

<script setup lang="ts">
const stores = {
  modal: useModalStore(),
};

</script>
