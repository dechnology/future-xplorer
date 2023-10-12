<template>
  <div class="flex w-full flex-col">
    <label
      class="flex h-full w-full flex-1 flex-col items-center justify-center bg-black bg-opacity-20"
      :class="!disabled && 'cursor-pointer transition-all hover:bg-opacity-30'"
    >
      <Icon v-bind="iconNow" />
      <p v-if="text">{{ textNow }}</p>
      <input
        type="file"
        class="hidden"
        :disabled="disabled"
        :accept="accept"
        @change.prevent="handleFileChange"
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
  status?: string;
}

const props = withDefaults(defineProps<Props>(), {
  file: null,
  activeIcon: () => ({
    name: 'material-symbols:add-photo-alternate',
    size: '5rem',
  }),
  disabledIcon: () => ({ name: 'mdi:image', size: '5rem' }),
  disabled: false,
  status: 'waiting',
  text: '請點擊上傳檔案',
});

const emit = defineEmits<{
  (e: 'update:file', file?: File): void;
  (e: 'blobUrlCreated', url: string): void;
}>();

const iconChangeTo = ref(props.activeIcon);
const iconNow = computed(() => {
  console.log('get iconNow');
  console.log('props.disabled =>', props.disabled);
  console.log('props.status =>', props.status);
  if (props.disabled) {
    return props.disabledIcon;
  }
  if (props.status === 'waiting') {
    iconChangeTo.value = {
      name: 'material-symbols:add-photo-alternate',
      size: '5rem',
    };
  } else if (props.status === 'prompt') {
    iconChangeTo.value = {
      name: 'svg-spinners:dot-revolve',
      size: '5rem',
    };
  } else if (props.status === 'promptError') {
    iconChangeTo.value = {
      name: 'line-md:alert-square',
      size: '5rem',
    };
  } else if (props.status === 'avatar') {
    iconChangeTo.value = {
      name: 'svg-spinners:blocks-wave',
      size: '5rem',
    };
  } else if (props.status === 'avatarError') {
    iconChangeTo.value = {
      name: 'line-md:account-alert',
      size: '5rem',
    };
  } else if (props.status === 'uploading') {
    iconChangeTo.value = {
      name: 'material-symbols:model-training',
      size: '5rem',
    };
  } else if (props.status === 'uploadingError') {
    iconChangeTo.value = {
      name: 'line-md:upload-loop',
      size: '5rem',
    };
  } else if (props.status === 'finished') {
    iconChangeTo.value = {
      name: 'material-symbols:how-to-reg',
      size: '5rem',
    };
  }

  console.log('new props.activeIcon =>', props.activeIcon.name);
  console.log('new iconChangeTo =>', iconChangeTo);
  return iconChangeTo.value;
});
const textChangeTo = ref(props.text);
const textNow = computed(() => {
  console.log('get iconNow');
  console.log('props.disabled =>', props.disabled);
  console.log('props.status =>', props.status);
  if (props.disabled) {
    return props.disabledIcon;
  }
  if (props.status === 'waiting') {
    textChangeTo.value = '點擊上傳圖片';
  } else if (props.status === 'prompt') {
    textChangeTo.value = '人物提示詞產生中...';
  } else if (props.status === 'promptError') {
    textChangeTo.value = '暫時無法產生人物提示詞';
  } else if (props.status === 'avatar') {
    textChangeTo.value = '人物圖片生成中...';
  } else if (props.status === 'prompt') {
    textChangeTo.value = '暫時無法產生人物圖片';
  } else if (props.status === 'uploading') {
    textChangeTo.value = '圖片上傳中...';
  } else if (props.status === 'prompt') {
    textChangeTo.value = '暫時無法上傳圖片';
  } else if (props.status === 'finished') {
    textChangeTo.value = '圖片上傳完畢';
  }

  console.log('new textChangeTo =>', textChangeTo);
  return textChangeTo.value;
});

const handleFileChange = (e: Event) => {
  const inputEl = e.target as HTMLInputElement;
  const files = inputEl.files;

  if (!files) {
    console.log('no file selected');
    return;
  }

  console.log('Selected file: ', files[0]);

  emit('update:file', files[0]);
  // emit('blobUrlCreated', URL.createObjectURL(files[0]));
};
</script>
