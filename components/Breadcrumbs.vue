<template>
  <div class="flex justify-between px-2 text-[8px] xl:px-4 xl:text-base">
    <ol class="flex items-center gap-1">
      <NuxtLink
        to="/"
        class="transition-all hover:text-gray-600 active:text-gray-400"
      >
        <Icon name="mdi:home" class="h-3 w-3 xl:h-5 xl:w-5" />
      </NuxtLink>
      <li v-if="workshop" class="flex items-center gap-1">
        <Icon name="mdi:circle-small" class="h-3 w-3 xl:h-5 xl:w-5" />
        <NuxtLink
          :to="workshop.path"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          {{ workshop.name }}
        </NuxtLink>
      </li>
      <li v-if="issue" class="flex items-center gap-1">
        <Icon name="mdi:circle-small" class="h-3 w-3 xl:h-5 xl:w-5" />
        <NuxtLink
          :to="issue.path"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          {{ issue.name }}
        </NuxtLink>
      </li>
    </ol>
    <NuxtLink
      v-if="backPath"
      :to="backPath"
      class="flex items-center gap-2 transition-all hover:text-gray-600 active:text-gray-400 xl:gap-4"
    >
      <Icon name="mdi:arrow-left-thin" class="h-3 w-3 xl:h-5 xl:w-5" />
      <span>返回</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { workshop, issue, backPath } = storeToRefs(useBreadcrumbsStore());
</script>
