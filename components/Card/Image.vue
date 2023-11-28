<template>
  <div class="relative h-24 w-full shrink-0 xl:h-52">
    <NuxtImg v-if="url" class="h-full w-full object-cover" :src="url" alt="" />
    <div v-else class="flex h-full items-center justify-center bg-gray-300">
      <Icon name="mdi:image" size="5rem" />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  url?: string | null;
  download?: boolean;
}

withDefaults(defineProps<Props>(), {
  url: undefined,
});
</script>
