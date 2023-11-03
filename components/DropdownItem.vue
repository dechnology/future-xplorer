<template>
  <li
    class="cursor-pointer p-2 text-sm transition-all ease-in-out xl:p-4 xl:text-base"
    :class="active ? 'bg-gray-200' : 'hover:bg-gray-300'"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean }>(), { active: false });
</script>
