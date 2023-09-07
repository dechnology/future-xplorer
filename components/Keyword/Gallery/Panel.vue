<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ inputClasses?: string }>();
const classes = computed(() =>
  twMerge(
    'flex h-full min-h-0 shrink grow basis-auto flex-col gap-5 px-4 pt-4',
    props.inputClasses
  )
);
</script>
