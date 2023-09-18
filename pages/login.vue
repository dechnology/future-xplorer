<template>
  <NuxtLayout>
    <div class="m-auto flex flex-col gap-8 rounded-2xl bg-slate-100 p-8">
      <Logo class="m-auto w-1/3 fill-purple-500" />
      <InputText
        v-model="uid"
        title="UID"
        placeholder="請輸入 UID"
        :disabled="false"
        :select-only="false"
      />
      <InputText
        v-model="username"
        title="使用者名稱"
        placeholder="請輸入使用者名稱"
        :disabled="false"
        :select-only="false"
      />
      <div class="flex justify-center gap-8">
        <CardButton
          class="w-48 rounded-lg bg-blue-500 py-3 text-2xl text-white"
          @click="handleStart"
        >
          開始
        </CardButton>
        <CardButton
          class="w-48 rounded-lg bg-gray-400 py-3 text-2xl text-white"
          @click="() => (uid = generateUid())"
        >
          自動產生 UID
        </CardButton>
      </div>
    </div>
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

const handleStart = async (e: Event) => {
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

  router.push('/');
};
</script>
