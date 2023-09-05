<template>
  <NuxtLink
    to="/"
    class="group flex items-center gap-3 duration-1000 ease-in-out"
  >
    <Logo
      v-if="showLogo"
      class="h-8 w-[29.45px] fill-white transition-all group-hover:fill-slate-200"
    />
    <h1
      class="text-2xl font-bold leading-tight text-white transition-all group-hover:text-slate-200"
    >
      <slot />
    </h1>
  </NuxtLink>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ showLogo?: boolean }>(), { showLogo: true });
</script>
