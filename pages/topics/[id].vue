<template>
  <div class="flex items-start gap-8 px-14 pt-36">
    <div class="basis-1/3 border border-solid border-red-500">
      <h2 class="text-3xl">{{ title }}</h2>
      <p>{{ description }}</p>
      <!-- NEW ISSUE FORM -->
    </div>
    <div class="basis-2/3 border border-solid border-red-500">
      <div>
        <Icon size="1.25rem" name="mdi:arrow-left" />
        <span>返回</span>
      </div>
      <!-- ISSUES -->
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const topic = await useFetch(`/api/topics/${route.params.id}`);

const title = '議題列表';
const description =
  '第一步需先決定整體研究的核心主題為何，後續的所有情境都會需在這個主題架構下。';
</script>

<style scoped></style>
