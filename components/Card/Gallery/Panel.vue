<template>
  <div
    class="flex h-full min-h-0 shrink grow basis-auto flex-col gap-2 xl:gap-5"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  includeSearchBar?: boolean;
}

withDefaults(defineProps<Props>(), {
  includeSearchBar: true,
});

defineEmits<{
  (e: 'search', value: string): void;
}>();
</script>
