<template>
  <form action="" class="p-8">
    <div class="flex">
      <h3>{{ formTitle }}</h3>
      <p>建立者：{{ creator }}</p>
    </div>
    <div class="flex flex-col">
      <input type="text" name="" id="" />
      <input type="textarea" />
      <button type="submit">新增</button>
    </div>
  </form>
</template>

<script setup lang="ts">
const creator = '鄭泰控';
const formTitle = '新增議題';
</script>

<style scoped></style>
