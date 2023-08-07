<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <PeoplePanel />
      </template>
      <PeopleGallery />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts"></script>
