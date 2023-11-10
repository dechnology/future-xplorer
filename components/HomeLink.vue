<template>
  <NuxtLink
    to="/"
    class="group flex items-center gap-3 duration-1000 ease-in-out"
  >
    <Logo
      v-if="showLogo"
      class="h-4 w-[15px] fill-white transition-all group-hover:fill-slate-200 md:h-8 md:w-[29.45px]"
    />
    <h1
      class="text-2xl font-bold leading-tight text-white transition-all group-hover:text-slate-200 max-2xl:hidden"
    >
      <slot />
    </h1>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showLogo?: boolean }>(), { showLogo: true });
</script>
