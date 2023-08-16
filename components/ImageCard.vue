<template>
  <div
    class="flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-solid border-gray-400 transition-all hover:shadow-2xl"
    :class="isActivated ? 'bg-gray-200' : 'bg-white hover:bg-gray-100'"
  >
    <!-- Image -->
    <div v-if="image" class="h-48 w-full">
      <img class="h-full w-full object-cover" :src="image" alt="" />
    </div>
    <div class="relative flex h-full flex-col whitespace-pre-line px-5 py-6">
      <!-- Lines -->
      <div class="text-sm">{{ lines.join('\n') }}</div>
      <!-- Footnotes -->
      <div class="absolute bottom-5 right-5 text-xs text-gray-300">
        {{ footnotes.join('\n') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  lines: string[];
  footnotes: string[];
  image?: string;
  isActivated: boolean;
}
const props = defineProps<Props>();
</script>
