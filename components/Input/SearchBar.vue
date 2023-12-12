<template>
  <form
    class="flex shrink-0 grow-0 items-center gap-2 px-2 text-xs xl:gap-5 xl:text-lg"
    @submit.prevent="handleSubmit"
  >
    <div class="relative grow">
      <div
        class="absolute inset-y-0 left-3 flex h-full items-center justify-center"
      >
        <Icon class="h-5 w-5 text-center xl:h-8 xl:w-8" name="mdi:magnify" />
      </div>
      <input
        ref="inputRef"
        type="text"
        class="block h-full w-full rounded border border-solid border-gray-900 pl-10 text-xs xl:pl-14 xl:text-base"
        :class="modelValue && 'pr-10 xl:pr-14'"
        :value="modelValue"
        :placeholder="placeholder"
        @input="handleInputChange"
        @keypress.enter.prevent="() => handleSubmit()"
      />
      <div
        v-if="modelValue || searchBuffer"
        class="absolute inset-y-0 right-3 flex h-full items-center justify-center"
      >
        <Icon
          class="h-5 w-5 cursor-pointer text-center transition-all hover:opacity-50 xl:h-8 xl:w-8"
          name="mingcute:delete-back-line"
          @click="handleClear"
        />
      </div>
    </div>
    <button
      class="h-full rounded bg-blue-600 px-3 py-1 text-xs text-white xl:px-6 xl:text-base"
    >
      {{ buttonText }}
    </button>
  </form>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  placeholder?: string;
  buttonText?: string;
}

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
}>();

const props = withDefaults(defineProps<Props>(), {
  placeholder: '輸入關鍵字',
  buttonText: '搜尋',
});

const stores = {
  modal: useModalStore(),
};

const { ignoreNextClose } = storeToRefs(stores.modal);

const inputRef = ref<HTMLInputElement | null>(null);
const searchBuffer = ref('');

const handleInputChange = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLInputElement).value);
};

const handleSubmit = () => {
  ignoreNextClose.value = true;
  searchBuffer.value = props.modelValue;
  emit('search');
};

const handleClear = () => {
  ignoreNextClose.value = true;

  searchBuffer.value = '';
  emit('update:modelValue', '');
  emit('search');
};
</script>
