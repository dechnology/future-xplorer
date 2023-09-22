<template>
  <div class="flex flex-col overflow-hidden rounded-lg">
    <NuxtImg
      v-if="currentPersonaImage"
      :src="currentPersonaImage"
      placeholder="https://api.iconify.design/line-md:loading-alt-loop.svg"
      alt=""
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPersonaImage: string | null;
}
defineProps<Props>();
</script>
