<template>
  <div class="flex w-full flex-col">
    <label
      class="flex h-full w-full flex-1 flex-col items-center justify-center bg-black bg-opacity-20"
      :class="!disabled && ' cursor-pointer transition-all hover:bg-opacity-30'"
    >
      <Icon v-if="!disabled && activeIcon" v-bind="activeIcon" />
      <Icon v-if="disabled && disabledIcon" v-bind="disabledIcon" />
      <p v-if="text">{{ text }}</p>
      <input
        type="file"
        class="hidden"
        :disabled="disabled"
        @change="handleFileChange"
        :accept="accept"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  accept?: string;
  activeIcon?: { name: string; size: string };
  disabledIcon?: { name: string; size: string };
  text?: string;
  file?: File | null;
  disabled: boolean;
}

const props = withDefaults(defineProps<Props>(), { file: null });

const emit = defineEmits<{
  (e: 'update:file', file?: File): void;
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
