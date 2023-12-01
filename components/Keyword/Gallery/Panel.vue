<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  inputClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
  inputClasses: '',
});

const classes = computed(() =>
  twMerge('flex h-full w-full flex-col gap-5 px-4 pt-4', props.inputClasses)
);
</script>
