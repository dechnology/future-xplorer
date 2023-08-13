<template>
  <div
    class="flex items-center justify-between bg-primary-500 px-12 text-white"
  >
    <NuxtLink
      to="/"
      class="flex items-center gap-3 fill-white transition-all hover:fill-gray-100 hover:text-gray-100"
    >
      <Logo class="h-8 w-8" />
      <h1 class="my-6 text-2xl">未來情境探索輔助工具</h1>
    </NuxtLink>
    <div class="flex items-center gap-2">
      <IssueTab v-if="tab" />
      <div
        @click="handleLogout"
        class="cursor-pointer transition-all hover:text-gray-300"
      >
        <Icon size="1.75rem" name="mdi:logout" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';

const route = useRoute();
const router = useRouter();
const tabStore = useTabStore();
const authStore = useAuthStore();

const { tab } = storeToRefs(tabStore);

onMounted(() => {
  tabStore.setTabByPath(route.fullPath);
});

watch(route, (newRoute) => {
  tabStore.setTabByPath(newRoute.fullPath);
});

const handleLogout = async () => {
  authStore.clearAccessToken();
  const { error } = await useFetch('/api/logout', { method: 'DELETE' });

  if (error.value) {
    console.error(error.value);
  }

  router.push('/login');
};
</script>
