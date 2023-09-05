<template>
  <ol class="flex items-center">
    <li
      v-for="issueTab in issueTabs"
      :key="issueTab.name"
      class="flex h-12 w-36 cursor-pointer items-center justify-center font-medium transition-all"
      :class="
        tab === issueTab.name
          ? 'border-b-2 border-solid border-white'
          : 'text-gray-600 hover:border-b-2 hover:border-solid hover:border-gray-300'
      "
    >
      <NuxtLink :to="`./${issueTab.name}`">
        {{ issueTab.title }}
      </NuxtLink>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { issueTabs } from '@/utils/issueTabs';
const { tab } = storeToRefs(useTabStore());
</script>
