<template>
  <div class="flex gap-2 pl-2 xl:pl-4">
    <h2
      v-if="$slots.title"
      class="text-xl font-semibold text-black xl:text-2xl xl:text-[32px] xl:font-bold"
    >
      <slot name="title" />
    </h2>
    <Icon
      name="material-symbols:lightbulb-circle-outline-rounded"
      class="h-4 w-4 text-blue-500 xl:h-8 xl:w-8"
    />
    <slot name="tooltip" />
  </div>
  <p
    v-if="$slots.description"
    class="pl-2 text-xs leading-relaxed text-black xl:pl-4 xl:text-base"
  >
    <slot name="description" />
  </p>
</template>
