<template>
  <div
    class="flex items-center justify-between bg-primary-500 px-12 text-white"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-3 fill-white transition-all hover:fill-gray-100 hover:text-gray-100"
    >
      <Logo class="h-8 w-8" />
      <h1 class="my-6 text-2xl">{{ heading }}</h1>
    </NuxtLink>
    <div class="flex items-center gap-2">
      <ol class="flex items-center" v-if="isIssueTabRoute">
        <li
          class="flex h-12 w-36 items-center justify-center"
          v-for="item in issueNavItems"
          :key="item.path"
        >
          <NuxtLink :to="item.path">
            {{ item.title }}
          </NuxtLink>
        </li>
      </ol>
      <Icon size="1.75rem" name="mdi:logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
const heading = '未來情境探索輔助工具';

const issueNavItems = [
  { title: '人物清單', path: './people' },
  { title: '案例整理', path: './cases' },
  { title: '關鍵字萃取', path: './keywords' },
  { title: '關鍵字分享', path: './sharing' },
  { title: '模板設計', path: './models' },
  { title: '故事產製', path: './stories' },
  { title: '圖片產製', path: './images' },
];

const tabsPattern = issueNavItems
  .map((item) => item.path.replace('./', ''))
  .join('|');

const regex = new RegExp(`^/workshop/[\\w-]+/issue/[\\w-]+/(${tabsPattern})$`);

const isIssueTabRoute = computed(() => {
  return regex.test(useRoute().fullPath);
});
</script>
