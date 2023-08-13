<template>
  <div class="m-auto flex flex-col gap-8 rounded-2xl bg-slate-100 p-8">
    <Logo class="m-auto w-1/3 fill-purple-500" />
    <InputText v-model="uid" title="UID" placeholder="請輸入 UID" />
    <InputText
      v-model="username"
      title="使用者名稱"
      placeholder="請輸入使用者名稱"
    />
    <div class="flex justify-center gap-8">
      <CardButton
        @click="handleStart"
        class="w-48 rounded-lg bg-blue-500 py-3 text-2xl text-white"
        body="開始"
      />
      <CardButton
        @click="() => (uid = generateUid())"
        class="w-48 rounded-lg bg-gray-400 py-3 text-2xl text-white"
        body="自動產生 UID"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});

const router = useRouter();
const authStore = useAuthStore();

const uid = ref('');
const username = ref('');

const handleStart = async (e: Event) => {
  const { data, error } = await useFetch('/api/login', {
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
