<template>
  <button :type="type">
    <div
      class="flex h-full w-full cursor-pointer items-center gap-4 px-4 transition-all hover:shadow-2xl"
    >
      <Icon
        v-if="icon"
        :class="`text-${icon.color}`"
        :name="icon.name"
        :size="icon.size"
      />
      <div class="w-full text-center">{{ body }}</div>
    </div>
  </button>
</template>

<script setup lang="ts">
interface Props {
  icon?: {
    name: string;
    size: string;
    color?: string;
  };
  body?: string;
  type?: 'button' | 'submit' | 'reset';
}
const props = withDefaults(defineProps<Props>(), {
  type: 'button',
});
</script>
