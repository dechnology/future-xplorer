<template>
  <button class="shink-0 grow-0" :disabled="disabled">
    <ClientOnly>
      <div
        class="flex h-full w-full items-center gap-1 transition-all hover:shadow-2xl xl:gap-2"
        :class="{ 'opacity-50': disabled }"
      >
        <div v-if="disabled" class="px-2">
          <Icon name="mdi:loading" class="h-4 w-4 animate-spin xl:h-8 xl:w-8" />
        </div>
        <div
          class="flex w-full items-center justify-center px-4 py-2 text-center text-xs xl:px-8 xl:py-3 xl:text-base"
        >
          <slot />
        </div>
      </div>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>
