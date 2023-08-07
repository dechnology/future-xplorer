<template>
  <div>
    <input
      @keyup.enter="
        () => {
          console.log('enter pressed');
        }
      "
      type="text"
      class="h-16"
      :disabled="disabled"
      :class="inputClasses"
    />
  </div>
</template>

<script setup lang="ts">
import { Chip } from '@/types/chip';

interface Props {
  chips: Chip[];
  disabled?: boolean;
  inputClasses?: string;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  keyup: [id: number];
  update: [value: string];
}>();
</script>
