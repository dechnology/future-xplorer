<template>
  <div class="flex w-full flex-col">
    <label
      class="flex h-full w-full flex-1 flex-col items-center justify-center bg-black bg-opacity-20"
      :class="!disabled && ' cursor-pointer transition-all hover:bg-opacity-30'"
    >
      <Icon v-bind="disabled ? disabledIcon : activeIcon" />
      <p v-if="text">{{ text }}</p>
      <input
        type="file"
        class="hidden"
        :disabled="disabled"
        @change.prevent="handleFileChange"
        :accept="accept"
      />
    </label>
  </div>
</template>

<script lang="ts" setup>
interface IconType {
  name: string;
  size: string;
}

interface Props {
  file: File | null;
  accept?: string;
  activeIcon?: IconType;
  disabledIcon?: IconType;
  text?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  activeIcon: () => ({
    name: 'material-symbols:add-photo-alternate',
    size: '5rem',
  }),
  disabledIcon: () => ({ name: 'mdi:image', size: '5rem' }),
  disabled: false,
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

  console.log('selected file: ', files[0]);

  emit('update:file', files[0]);
  emit('blobUrlCreated', URL.createObjectURL(files[0]));
};
</script>
