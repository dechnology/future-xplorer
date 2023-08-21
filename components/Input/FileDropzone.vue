<template>
  <div
    class="flex w-full flex-col rounded-2xl border border-solid border-gray-400 bg-slate-200"
  >
    <label
      class="flex h-full w-full flex-1 cursor-pointer flex-col items-center justify-center transition-all hover:bg-slate-300 hover:shadow-2xl"
    >
      <Icon v-if="icon" v-bind="icon" />
      <p v-if="text">{{ text }}</p>
      <input
        type="file"
        class="hidden"
        @change="handleFileChange"
        :accept="accept"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  accept?: string;
  icon?: { name: string; size: string };
  text?: string;
  file: File | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:file', file: File | null): void;
  (e: 'blobUrlCreated', url: string): void;
}>();

const handleFileChange = (event: Event) => {
  const inputEl = event.target as HTMLInputElement;
  const files = inputEl.files;

  if (!files) {
    console.log('no file selected');
    return;
  }

  console.log('selected file: ', files[0]);

  emit('update:file', files[0]);
  emit('blobUrlCreated', URL.createObjectURL(files[0]));
};
</script>
