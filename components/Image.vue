<template>
  <NuxtImg v-if="url" :src="url" alt="人物圖遺失" />
  <div v-else class="flex h-48 w-full shrink-0 grow flex-col xl:h-72">
    <label
      class="flex h-full w-full flex-1 flex-col items-center justify-center bg-black bg-opacity-20"
      :class="
        imageState === 'IDLE' &&
        'cursor-pointer transition-all hover:bg-opacity-30'
      "
    >
      <Icon
        :name="ImageStates[imageState].iconName"
        class="h-14 w-14 xl:h-20 xl:w-20"
      />
      <p class="text-xs lg:text-sm xl:text-base">
        {{ ImageStates[imageState].hint }}
      </p>
      <input type="file" class="hidden" @change.prevent="handleFileChange" />
    </label>
  </div>
</template>

<script lang="ts" setup>
import type { ImageStateKey } from '~/types';

interface Props {
  file: File | null;
  imageState: ImageStateKey;
  url?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  imageState: 'IDLE',
  url: undefined,
});

const emit = defineEmits<{
  (e: 'update:file', file?: File): void;
  (e: 'blobUrlCreated', url: string): void;
}>();

const handleFileChange = (e: Event) => {
  const inputEl = e.target as HTMLInputElement;
  const files = inputEl.files;

  if (!files) {
    console.log('no file selected');
    return;
  }

  console.log('Selected file: ', files[0]);

  emit('update:file', files[0]);
  emit('blobUrlCreated', URL.createObjectURL(files[0]));
};
</script>
