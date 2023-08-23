<template>
  <div class="flex items-end gap-4">
    <h3 class="text-2xl font-medium text-blue-950">
      {{ title }}
    </h3>
    <div class="text-sm text-gray-500">
      <span>建立者：</span>
      <span v-if="creator">{{ creator.name }}</span>
      <span v-else-if="user">{{ user.name }}</span>
      <span v-else>Unknown</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '@/types';

interface Props {
  title: string;
  creator?: User;
  user?: User | null;
}
const props = defineProps<Props>();
</script>
