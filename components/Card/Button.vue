<template>
  <button :disabled="disabled">
    <div
      class="flex h-full w-full cursor-pointer items-center gap-2 transition-all hover:shadow-2xl"
      :class="{ 'opacity-50': disabled }"
    >
      <div class="flex w-full flex-col items-center justify-center text-center">
        <slot />
      </div>
    </div>
  </button>
</template>

<script lang="ts">
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
