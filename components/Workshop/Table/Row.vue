<template>
  <tr :class="trClasses">
    <slot />
  </tr>
</template>

<script setup lang="ts">
interface Props {
  active?: boolean;
  classes?: string;
}
const props = withDefaults(defineProps<Props>(), {
  active: false,
  classes: '',
});
const trClasses = computed(() =>
  twMerge(
    [
      'h-12',
      'xl:h-20',
      'ease-in-out',
      'cursor-pointer',
      'border-b',
      'border-solid',
      'border-gray-300',
      'transition-all',
    ],
    props.classes,
    props.active ? 'bg-gray-200' : ['hover:bg-gray-100']
  )
);
</script>
