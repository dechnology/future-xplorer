<template>
  <div
    class="flex w-fit min-w-fit cursor-pointer items-center gap-1 px-4 py-2 transition-all xl:px-6 xl:py-3 xl:text-xl xl:font-medium"
    :class="
      active ? 'bg-indigo-500 text-white' : ' text-black hover:bg-indigo-100'
    "
  >
    <slot />
    <svg
      v-if="active"
      class="h-4 w-4 xl:h-6 xl:w-6"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 -1.13945e-07L8 12"
        stroke="#CDFF00"
        stroke-width="2"
        stroke-miterlimit="10"
      />
      <path
        d="M15 10L8.04106 18L1 10"
        stroke="#CDFF00"
        stroke-width="2"
        stroke-miterlimit="10"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ active?: boolean }>(), { active: false });
</script>
