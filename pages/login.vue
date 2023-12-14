<template>
  <NuxtLayout>
    <ClientOnly>
      <form
        class="m-auto flex w-1/3 flex-col gap-8 bg-white p-8 shadow-lg"
        @submit.prevent="handleStart"
      >
        <div class="flex flex-col gap-6">
          <!-- <Logo class="m-auto w-1/3 fill-purple-500" /> -->
          <NuxtImg src="login_logo.png" class="m-auto w-1/3 rounded-full" />
          <h1 class="text-center text-2xl font-bold">未來情境探索輔助工具</h1>
        </div>
        <InputComponent
          v-model="uid"
          type="text"
          title="UID"
          placeholder="請輸入 UID"
          :disabled="false"
          :select-only="false"
        />
        <InputComponent
          v-model="username"
          type="text"
          title="使用者名稱"
          placeholder="請輸入使用者名稱"
          :disabled="false"
          :select-only="false"
        />
        <div class="flex justify-center gap-8">
          <CardButton
            class="rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
          >
            開始
          </CardButton>
          <CardButton
            class="rounded-lg bg-lime-600 text-white hover:bg-lime-700"
            @click.prevent="() => (uid = generateUid())"
          >
            自動產生 UID
          </CardButton>
        </div>
      </form>
    </ClientOnly>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { LoginResponse } from '@/types';

definePageMeta({
  layout: false,
});

const router = useRouter();
const authStore = useAuthStore();

const uid = ref('');
const username = ref('');

const handleStart = async () => {
  if (!uid.value) {
    alert('請輸入 UID');
    return;
  }

  if (!username.value) {
    alert('請輸入使用者名稱');
    return;
  }

  const { data, error } = await useFetch<LoginResponse>('/api/login', {
    method: 'post',
    body: {
      uid: uid.value,
      name: username.value,
    },
  });

  if (error.value) {
    console.error(error.value);
    return;
  }

  if (!data.value) {
    console.error('data is null');
    return;
  }

  authStore.setAccessToken(data.value.accessToken);

  localStorage.setItem('uid', uid.value);
  localStorage.setItem('username', username.value);

  router.push('/');
};

onMounted(() => {
  uid.value = localStorage.getItem('uid') || '';
  username.value = localStorage.getItem('username') || '';
});
</script>
