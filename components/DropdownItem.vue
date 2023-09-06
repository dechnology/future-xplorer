<template>
  <li
    class="cursor-pointer p-4 transition-all ease-in-out"
    :class="active ? 'bg-gray-200' : 'hover:bg-gray-300'"
  >
    <slot />
  </li>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});
</script>
