<template>
  <TopicItem v-for="i in 10" v-bind="fakeTopic" />
</template>

<script setup lang="ts">
const fakeTopic = {
  title: 'AI對工作職場的衝擊',
  creator: '羅力控',
  createdAt: new Date(2000, 10, 7),
  updatedAt: new Date(),
  locked: false,
};
</script>

<style scoped></style>
