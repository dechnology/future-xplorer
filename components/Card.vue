<template>
  <div :class="cardClasses">
    <slot name="image" />
    <div class="flex shrink grow basis-auto flex-col items-center p-5">
      <slot />
    </div>
    <!-- <div v-if="image || image === null" class="h-52 w-full shrink-0">
      <NuxtImg
        v-if="image"
        class="h-full w-full object-cover"
        :src="image"
        alt=""
      />
      <div v-else class="flex h-full items-center justify-center bg-gray-300">
        <Icon name="mdi:image" size="5rem" />
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ active?: boolean }>(), {
  active: false,
});

const cardClasses = computed(() =>
  twMerge(
    [
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
