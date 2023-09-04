<template>
  <form
    class="flex flex-col justify-start gap-5 rounded-lg bg-white p-8 shadow"
  >
    <div class="flex items-start justify-between">
      <CardHeader :title="formTitle" :creator-name="creatorName" />
      <slot name="icon-actions" />
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
    <slot name="actions" />
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
