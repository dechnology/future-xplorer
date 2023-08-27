<template>
  <div
    class="flex flex-col items-center text-center text-2xl font-semibold text-neutral-500"
  >
    <Icon v-bind="icon" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: { name: string; size: string } }>();
</script>
