<template>
  <div
    v-if="activeIllustration"
    class="flex h-full gap-4 overflow-y-auto xl:gap-8"
  >
    <div class="flex h-fit basis-1/2 flex-col overflow-hidden rounded-lg">
      <NuxtImg :src="activeIllustration.image" :placeholder="[50, 25]" />
    </div>
    <div
      class="flex h-full basis-1/2 flex-col gap-4 font-['Roboto'] text-sm text-neutral-600 xl:gap-8 xl:text-base"
    >
      <div>
        <div class="font-bold xl:text-lg">故事:</div>
        <p>{{ activeIllustration.story }}</p>
      </div>
      <div>
        <div class="font-bold xl:text-lg">Prompt:</div>
        <p>{{ activeIllustration.prompt }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const stores = {
  illustration: useIllustrationStore(),
};
const { activeIllustration } = storeToRefs(stores.illustration);
</script>
