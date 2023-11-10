<template>
  <p
    :class="classes"
    :style="
      lineClamp
        ? {
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: lineClamp,
          }
        : {}
    "
  >
    <slot />
  </p>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const props = defineProps<{ inputClasses?: string; lineClamp?: number }>();

const classes = computed(() =>
  twMerge(
    [
      'whitespace-break-spaces',
      'w-full',
      'text-justify',
      'text-[8px]',
      'xl:text-xs',
      'font-normal',
      'leading-snug',
      'text-black',
      'text-opacity-80',
    ],
    props.inputClasses
  )
);
</script>
