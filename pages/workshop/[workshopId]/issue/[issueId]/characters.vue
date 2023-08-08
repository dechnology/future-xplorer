<template>
  <Suspense>
    <NuxtLayout>
      <template #detail-pane>
        <CharacterPanel />
      </template>
      <CharacterGallery />
    </NuxtLayout>
    <template #fallback> Loading </template>
  </Suspense>
</template>

<script setup lang="ts"></script>
