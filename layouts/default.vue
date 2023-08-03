<template>
  <div class="flex items-start justify-center gap-8 bg-slate-50 px-14 pt-16">
    <div class="basis-1/3">
      <slot name="detail-pane" />
    </div>
    <div class="basis-2/3">
      <slot />
    </div>
  </div>
</template>
