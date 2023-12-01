<template>
  <div class="flex gap-2 pl-2 xl:pl-4">
    <h2
      v-if="$slots.title"
      class="text-xl font-semibold text-black xl:text-2xl xl:text-[32px] xl:font-bold"
    >
      <slot name="title" />
    </h2>
    <div v-if="$slots.tooltip" class="group relative">
      <Icon
        name="material-symbols:lightbulb-circle-outline-rounded"
        class="h-4 w-4 cursor-help text-blue-500 xl:h-6 xl:w-6"
      />
      <div
        class="absolute -top-4 left-[150%] z-10 h-[300px] w-[640px] origin-top-left scale-0 cursor-help overflow-y-auto rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 text-white transition-all group-hover:scale-100 xl:h-[480px] xl:w-[960px]"
      >
        <p class="whitespace-pre-wrap">
          <slot name="tooltip" />
        </p>
      </div>
    </div>
  </div>
  <p
    v-if="$slots.description"
    class="pl-2 text-xs leading-relaxed text-black xl:pl-4 xl:text-base"
  >
    <slot name="description" />
  </p>
</template>
