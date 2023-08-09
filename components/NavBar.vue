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
          v-for="item in issueNavItems"
          class="flex h-12 w-36 cursor-pointer items-center justify-center font-medium transition-all"
          :class="
            currentTab === item.name
              ? 'border-b-2 border-solid border-white'
              : 'text-gray-600 hover:border-b-2 hover:border-solid hover:border-gray-300'
          "
          :key="item.name"
        >
          <NuxtLink :to="`./${item.name}`">
            {{ item.title }}
          </NuxtLink>
        </li>
      </ol>
      <Icon size="1.75rem" name="mdi:logout" />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const heading = '未來情境探索輔助工具';

const issueNavItems = [
  { title: '人物清單', name: 'characters' },
  { title: '案例整理', name: 'cases' },
  { title: '關鍵字萃取', name: 'keywords' },
  { title: '關鍵字分享', name: 'sharing' },
  { title: '模板設計', name: 'templates' },
  { title: '故事產製', name: 'stories' },
  { title: '圖片產製', name: 'images' },
];

const tabsPattern = issueNavItems.map((item) => item.name).join('|');

const regex = new RegExp(`^/workshop/[\\w-]+/issue/[\\w-]+/(${tabsPattern})$`);

const isIssueTabRoute = computed(() => {
  return regex.test(route.fullPath);
});

const currentTab = computed(() => {
  console.log(isIssueTabRoute.value);

  if (!isIssueTabRoute.value) {
    return;
  }
  const match = route.fullPath.match(
    /^\/workshop\/(\d+)\/issue\/(\d+)\/([^\/]+)(\/.*)?$/
  );

  console.log(match);

  if (match) {
    return match[3];
  }
});

console.log(currentTab.value);
</script>
