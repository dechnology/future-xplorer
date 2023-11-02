<template>
  <div class="flex gap-2">
    <h2
      v-if="$slots.title"
      class="pl-2 text-xl font-bold text-black xl:pl-4 xl:text-[32px]"
    >
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
    class="pl-2 text-xs font-normal leading-relaxed text-black xl:pl-4 xl:text-base"
  >
    <slot name="description" />
  </p>
</template>
