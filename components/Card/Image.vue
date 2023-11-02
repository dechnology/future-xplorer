<template>
  <div class="relative h-24 w-full shrink-0 xl:h-52">
    <NuxtImg v-if="url" class="h-full w-full object-cover" :src="url" alt="" />
    <div v-else class="flex h-full items-center justify-center bg-gray-300">
      <Icon name="mdi:image" size="5rem" />
    </div>
    <a
      v-if="download && url"
      class="absolute bottom-2 right-2 origin-bottom-right transition-all hover:scale-125"
      download
      :href="url"
      target="_blank"
      @click.stop.prevent
    >
      <Icon
        name="mdi:download"
        size="2rem"
        class="cursor-pointer text-slate-700"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
interface Props {
  url?: string | null;
  download?: boolean;
}
withDefaults(defineProps<Props>(), {
  url: undefined,
  download: false,
});
</script>
