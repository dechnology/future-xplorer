<template>
  <div
    class="flex h-full flex-col items-center justify-center text-center text-2xl font-semibold text-neutral-500"
  >
    <Icon v-bind="icon" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: { name: string; size: string } }>();
</script>
