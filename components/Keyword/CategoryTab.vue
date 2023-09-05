<template>
  <div
    class="flex cursor-pointer items-center px-6 py-3 text-xl font-medium leading-7 transition-all"
    :class="
      active ? 'bg-indigo-500 text-white' : ' text-black hover:bg-indigo-100'
    "
  >
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});
</script>
