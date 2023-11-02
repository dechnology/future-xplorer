<template>
  <div class="flex shrink-0 grow-0 gap-5 text-xs lg:text-lg">
    <div class="relative grow">
      <div
        class="absolute inset-y-0 left-3 flex h-full items-center justify-center"
      >
        <Icon class="h-5 w-5 text-center lg:h-8 lg:w-8" name="mdi:magnify" />
      </div>
      <input
        type="text"
        class="block h-full w-full rounded border border-solid border-gray-900 bg-inherit pl-10 lg:pl-14"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <button
      class="rounded bg-blue-600 px-3 py-1 text-white lg:px-6"
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
