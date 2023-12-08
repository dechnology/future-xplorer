<template>
  <div class="flex items-center justify-around gap-5">
    <!-- <CardButton
      class="rounded-lg bg-red-400 text-white transition-all hover:bg-red-500"
      @click.prevent="handleRemove"
    >
      刪除
    </CardButton> -->
    <div class="flex basis-1/2 justify-between">
      <div class="flex basis-1/2 items-center justify-center">
        <Icon
          name="mdi-delete"
          class="h-6 w-6 cursor-pointer text-red-400 transition-all hover:text-red-500 xl:h-8 xl:w-8"
          @click.prevent="handleRemove"
        />
      </div>
      <CardButton
        class="rounded-lg bg-indigo-500 text-white"
        :class="!loading && 'transition-all hover:bg-indigo-600'"
        :disabled="loading"
        @click.prevent="handleStart"
      >
        開始
      </CardButton>
    </div>
    <div class="basis-1/2">
      <CardButton
        class="rounded-lg bg-black bg-opacity-40 text-white"
        :class="!loading && 'transition-all hover:bg-opacity-50'"
        :disabled="loading"
        @click.prevent="handleEdit"
      >
        編輯
      </CardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Workshop } from '@/types';

const { getTokenSilently } = useAuth();
const router = useRouter();
const stores = { workshops: useWorkshopsStore() };
const { activeId, state, loading } = storeToRefs(stores.workshops);

const handleRemove = async () => {
  try {
    if (!activeId.value) {
      throw new Error('No active workshop to remove');
    }

    loading.value = true;
    let token = await getTokenSilently();
    const data = await fetchResource<Workshop>(
      token,
      `/api/workshops/${activeId.value}`,
      { method: 'delete' }
    );
    console.log(data);

    token = await getTokenSilently();
    await stores.workshops.update(token);
    state.value = 'NEW';
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  loading.value = false;
};

const handleStart = () => {
  router.push(`/workshop/${activeId.value}`);
};

const handleEdit = () => {
  state.value = 'EDITING';
};
</script>
