<template>
  <li :class="classes">
    <slot />
  </li>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});

const classes = computed(() =>
  twMerge(
    [
      'flex',
      'h-12',
      'w-36',
      'cursor-pointer',
      'items-center',
      'justify-center',
      'font-medium transition-all',
    ],
    props.active
      ? ['border-b-2', 'border-solid', 'border-white', 'text-white']
      : [
          'text-gray-600',
          'hover:border-b-2',
          'hover:border-solid',
          'hover:border-gray-300',
          'hover:text-gray-100',
        ]
  )
);
</script>
