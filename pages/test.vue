<template>
  <div class="m-auto flex w-1/3 items-center justify-center gap-8">
    <button
      @click="handleClick"
      class="text rounded-md bg-blue-300 p-4 text-white"
    >
      Upload with URL
    </button>
  </div>
</template>

<script setup lang="ts">
import { AsyncData } from 'nuxt/app';
import { ResourceObject } from '@/types';

const { getTokenSilently } = await useAuth();

const handleClick = async () => {
  const token = await getTokenSilently();
  const { data, error } = (await useFetch('/api/s3/images', {
    method: 'post',
    headers: { Authorization: `Bearer ${token}` },
    body: { url: 'https://images3.alphacoders.com/132/1322715.png' },
  })) as AsyncData<ResourceObject<string> | null, Error>;

  if (error.value) {
    throw error.value;
  }

  if (!data.value) {
    throw new Error('data are null');
  }

  console.log(data.value.data);
};
</script>
