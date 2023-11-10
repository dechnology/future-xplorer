<template>
  <div class="flex min-h-0 shrink grow basis-auto flex-col gap-1 xl:gap-4">
    <slot name="header" />
    <div
      v-if="$slots.default"
      class="min-h-0 shrink grow basis-auto overflow-y-auto p-2"
    >
      <slot />
    </div>
  </div>
</template>
