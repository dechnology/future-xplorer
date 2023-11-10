<template>
  <div class="relative h-24 w-full shrink-0 xl:h-52">
    <NuxtImg v-if="url" class="h-full w-full object-cover" :src="url" alt="" />
    <div v-else class="flex h-full items-center justify-center bg-gray-300">
      <Icon name="mdi:image" size="5rem" />
    </div>
    <a
      v-if="download && url"
      class="absolute bottom-2 right-2 origin-bottom-right transition-all hover:scale-125"
      download="illustration.png"
      target="_blank"
      :href="url"
    >
      <Icon
        name="mdi:download"
        class="h-6 w-6 cursor-pointer text-slate-700 xl:h-8 xl:w-8"
      />
    </a>
  </div>
</template>

<script setup lang="ts">
interface Props {
  url?: string | null;
  download?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  url: undefined,
  download: false,
});

// const handleDownload = () => {
//   if (!props.url) {
//     return;
//   }

//   const link = document.createElement('a');
//   link.href = props.url;
//   link.setAttribute('download', '');
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };
</script>
