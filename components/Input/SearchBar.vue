<template>
  <div class="flex shrink-0 grow-0 gap-2 px-2 text-xs xl:gap-5 xl:text-lg">
    <div class="relative grow">
      <div
        class="absolute inset-y-0 left-3 flex h-full items-center justify-center"
      >
        <Icon class="h-5 w-5 text-center xl:h-8 xl:w-8" name="mdi:magnify" />
      </div>
      <input
        type="text"
        class="block h-full w-full rounded border border-solid border-gray-900 pl-10 text-xs xl:pl-14 xl:text-base"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
        @keypress.enter.prevent="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <button
      class="rounded bg-blue-600 px-3 py-1 text-xs text-white xl:px-6 xl:text-base"
      @click="$emit('search')"
    >
      {{ buttonText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder: string;
  buttonText: string;
  modelValue: string;
}

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'search'): void;
}>();

defineProps<Props>();
</script>
