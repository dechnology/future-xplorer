<template>
  <form
    class="flex shrink-0 grow-0 gap-2 px-2 text-xs xl:gap-5 xl:text-lg"
    @submit.prevent="handleSearch"
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
        :placeholder="placeholder"
      />
    </div>
    <button
      class="rounded bg-blue-600 px-3 py-1 text-xs text-white xl:px-6 xl:text-base"
    >
      {{ buttonText }}
    </button>
  </form>
</template>

<script setup lang="ts">
interface Props {
  placeholder: string;
  buttonText: string;
}

const emit = defineEmits<{
  (e: 'search', value: string): void;
}>();

defineProps<Props>();

const inputRef = ref<HTMLInputElement | null>(null);

const handleSearch = () => {
  if (!inputRef.value) return;

  emit('search', inputRef.value.value);
};
</script>
