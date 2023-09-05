<template>
  <div class="flex gap-2">
    <h2 v-if="$slots.title" class="pl-4 text-[32px] font-bold text-black">
      <slot name="title" />
    </h2>
    <Icon
      name="material-symbols:lightbulb-circle-outline-rounded"
      size="24px"
      class="text-blue-500"
    />
    <slot name="tooltip" />
  </div>
  <p
    v-if="$slots.description"
    class="pl-4 text-base font-normal leading-relaxed text-black"
  >
    <slot name="description" />
  </p>
</template>
