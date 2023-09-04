<template>
  <div class="bg-lime-600">
    <div
      class="mx-auto flex h-20 w-[1920px] shrink-0 items-center justify-between px-14"
    >
      <HomeLink>未來情境探索輔助工具</HomeLink>
      <div class="flex items-center gap-2">
        <IssueNav v-if="$route.params.issueId" />
        <Logout></Logout>
      </div>
    </div>
  </div>
</template>
