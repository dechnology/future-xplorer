<template>
  <div
    class="m-auto flex w-full flex-1 flex-col items-center justify-center gap-8"
  >
    <div v-if="!file" class="flex h-1/2 w-1/3 flex-col">
      <InputFileDropzone
        class="flex-1 bg-red-200"
        v-model:file="file"
        :accept="accept"
      />
    </div>
    <div v-else class="text-2xl">{{ file.name }}</div>
    <CardButton
      @click="handleClick"
      class="rounded-lg bg-blue-500 p-4 text-lg text-white"
      body="upload"
    />
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null);
const accept = 'image/*';

const handleClick = (e: Event) => {
  if (!file.value) {
    return;
  }

  uploadImageFile();
};
</script>
