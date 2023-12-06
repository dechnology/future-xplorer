<template>
  <p
    class=""
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
      'whitespace-pre-wrap',
      'line-clamp-[4]',
      'xl:line-clamp-[12]',
      '2xl:line-clamp-[10]',
      'w-full',
      'text-justify',
      'text-[8px]',
      'xl:text-[10px]',
      '2xl:text-xs',
      'font-normal',
      'leading-snug',
      'text-black',
      'text-opacity-80',
    ],
    props.inputClasses
  )
);
</script>
