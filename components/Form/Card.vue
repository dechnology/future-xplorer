<template>
  <ClientOnly>
    <form
      class="flex flex-col justify-start gap-2 rounded-lg bg-white p-4 shadow xl:gap-5 xl:p-8"
    >
      <div
        v-if="(formTitle && creatorName) || $slots['icon-actions']"
        class="flex items-start justify-between"
      >
        <CardHeader
          v-if="formTitle && creatorName"
          :title="formTitle"
          :creator-name="creatorName"
        />
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
    <template #fallback> <FormCardSkeleton /> </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { User } from '@/types';

const props = defineProps<{
  formTitle?: string;
  creator?: User;
  timestamps?: { createdAt: Date; updatedAt: Date };
}>();

const { username } = useAuth();

const creatorName = computed(() => {
  if (props.creator) {
    return props.creator.name;
  }

  if (username) {
    return username.value;
  }
});
</script>
