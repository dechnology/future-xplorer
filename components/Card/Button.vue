<template>
  <button class="shink-0 grow-0" :disabled="disabled">
    <ClientOnly>
      <div
        class="flex h-full w-full items-center gap-2 transition-all hover:shadow-2xl"
        :class="{ 'opacity-50': disabled }"
      >
        <Icon
          v-if="disabled"
          name="mdi:loading"
          size="3rem"
          class="animate-spin"
        />
        <div class="flex w-full items-center justify-center text-center">
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

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});
</script>
