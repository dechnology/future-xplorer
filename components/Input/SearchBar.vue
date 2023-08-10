<template>
  <div class="flex h-10 gap-5">
    <div class="relative grow">
      <div
        class="absolute inset-y-0 left-3 flex h-full items-center justify-center"
      >
        <Icon class="text-center" name="mdi:magnify" size="2rem" />
      </div>
      <input
        type="text"
        class="block h-full w-full rounded border border-solid border-gray-900 bg-inherit pl-14"
        :placeholder="placeholder"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <button class="rounded bg-blue-600 px-4 py-1 text-xs text-white">
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
const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
  buttonText: '搜尋',
});
</script>
