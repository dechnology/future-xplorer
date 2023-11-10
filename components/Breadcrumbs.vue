<template>
  <div class="flex justify-between px-2 text-[10px] xl:px-4 xl:text-base">
    <ol class="flex items-center">
      <li>
        <NuxtLink
          to="/"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          <Icon name="mdi:home" class="h-4 w-4 xl:h-5 xl:w-5" />
        </NuxtLink>
      </li>
      <li v-if="workshop">
        <NuxtLink
          :to="workshop.path"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          <span class="cursor-default font-bold">．</span>
          {{ workshop.name }}
        </NuxtLink>
      </li>
      <li v-if="issue">
        <NuxtLink
          :to="issue.path"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          <span class="cursor-default font-bold">．</span>
          {{ issue.name }}
        </NuxtLink>
      </li>
    </ol>
    <NuxtLink
      v-if="backPath"
      :to="backPath"
      class="flex items-center gap-2 transition-all hover:text-gray-600 active:text-gray-400 xl:gap-4"
    >
      <Icon name="mdi:arrow-left-thin" class="h-4 w-4 xl:h-5 xl:w-5" />
      <span>返回</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { workshop, issue, backPath } = storeToRefs(useBreadcrumbsStore());
</script>
