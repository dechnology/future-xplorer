<template>
  <button>
    <div
      class="flex h-full w-full cursor-pointer items-center gap-2 transition-all hover:shadow-2xl"
    >
      <div class="flex w-full flex-col items-center justify-center text-center">
        <slot />
      </div>
    </div>
  </button>
</template>
