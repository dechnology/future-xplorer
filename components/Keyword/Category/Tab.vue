<template>
  <div
    class="w-fit min-w-fit cursor-pointer px-3 py-1 transition-all xl:px-6 xl:py-3 xl:text-xl xl:font-medium"
    :class="
      active ? 'bg-indigo-500 text-white' : ' text-black hover:bg-indigo-100'
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean }>(), { active: false });
</script>
