<template>
  <form
    class="relative flex flex-col justify-start gap-5 rounded-lg bg-white p-8 shadow"
  >
    <div class="flex items-end gap-3">
      <h3 class="text-2xl font-medium leading-tight text-sky-950">
        {{ formTitle }}
      </h3>
      <div
        v-if="creatorName"
        class="text-sm font-medium leading-snug text-black text-opacity-60"
      >
        建立者：{{ creatorName }}
      </div>
    </div>
    <slot name="body" />
    <div v-if="timestamps" class="flex justify-center gap-2">
      <div
        class="text-center text-sm font-medium leading-snug text-black text-opacity-60"
      >
        建立時間：{{ format(timestamps.createdAt, 'yyyy-MM-dd') }}
      </div>
      <div
        class="text-center text-sm font-medium leading-snug text-black text-opacity-60"
      >
        更新時間：{{ format(timestamps.updatedAt, 'yyyy-MM-dd') }}
      </div>
    </div>
    <slot name="action" />
  </form>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { User } from '@/types';

const { formTitle, creator, username, timestamps } = defineProps<{
  formTitle: string;
  creator?: User;
  username?: string;
  timestamps?: { createdAt: Date; updatedAt: Date };
}>();

const creatorName = computed(() => {
  if (creator) {
    return creator.name;
  }

  if (username) {
    return username;
  }
});
</script>
