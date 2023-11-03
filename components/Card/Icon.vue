<template>
  <div
    class="flex h-full flex-col items-center justify-center text-center text-sm font-medium text-neutral-500 xl:text-2xl xl:font-semibold"
  >
    <Icon :name="icon.name" class="h-8 w-8 xl:h-16 xl:w-16" />
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: { name: string; size: string } }>();
</script>
