<template>
  <div :class="cardClasses">
    <slot name="image" />
    <div class="flex shrink grow basis-auto flex-col items-center p-5">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});

const cardClasses = computed(() =>
  twMerge(
    [
      'overflow-hidden',
      'rounded-2xl',
      'border',
      'border-black',
      'border-opacity-50',
      'cursor-pointer',
      'transition-all',
      'flex',
      'flex-col',
    ],
    props.active ? 'bg-gray-200' : ['hover:bg-gray-100']
  )
);
</script>
