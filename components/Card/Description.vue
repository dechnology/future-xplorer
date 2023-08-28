<template>
  <p :class="classes">
    <slot />
  </p>
</template>

<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const props = defineProps<{ inputClasses?: string }>();

const classes = computed(() =>
  twMerge(
    [
      'whitespace-break-spaces',
      'w-full',
      'text-justify',
      'text-xs',
      'font-normal',
      'leading-snug',
      'text-black',
      'text-opacity-80',
    ],
    props.inputClasses
  )
);
</script>
