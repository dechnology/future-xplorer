<template>
  <div class="h-52 w-full shrink-0">
    <NuxtImg v-if="url" class="h-full w-full object-cover" :src="url" alt="" />
    <div v-else class="flex h-full items-center justify-center bg-gray-300">
      <Icon name="mdi:image" size="5rem" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ url?: string | null }>();
</script>
