<template>
  <div class="flex justify-between">
    <ol class="flex items-center gap-1">
      <NuxtLink
        to="/"
        class="transition-all hover:text-gray-600 active:text-gray-400"
      >
        <Icon name="mdi:home" size="1.25rem" />
      </NuxtLink>
      <li v-if="workshop" class="flex items-center gap-1">
        <Icon name="mdi:circle-small" size="24px" />
        <NuxtLink
          :to="workshop.path"
          class="transition-all hover:text-gray-600 active:text-gray-400"
        >
          {{ workshop.name }}
        </NuxtLink>
      </li>
      <li v-if="issue" class="flex items-center gap-1">
        <Icon name="mdi:circle-small" size="24px" />
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
      class="flex items-center gap-4 transition-all hover:text-gray-600 active:text-gray-400"
    >
      <Icon name="mdi:arrow-left-thin" size="1.25rem" />
      <span>返回</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const breadcrumbStore = useBreadcrumbStore();
const { workshop, issue, backPath } = storeToRefs(breadcrumbStore);
</script>
