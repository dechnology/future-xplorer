<template>
  <div class="grid grid-cols-4 gap-4 rounded-2xl">
    <slot />
    <!-- <IconCard
      @click="() => handleClick()"
      class="h-[300px]"
      :isActivated="activeId === null"
      :icon="{ name: 'mdi:plus', size: '5rem' }"
      text="新增議題"
    />
    <Card
      v-for="i in issues"
      :key="i._id"
      @dblclick="() => handleDblclick(i._id)"
      @click="() => handleClick(i)"
      class="h-[300px]"
      :is-activated="activeId === i._id"
      :title="i.title"
      :description="i.description"
      :footnotes="[
        `建立者：${i.creator.name}`,
        `新增日期：${formatDate(i.createdAt)}`,
        `更新日期：${formatDate(i.updatedAt)}`,
      ]"
    /> -->
  </div>
</template>

<script setup lang="ts"></script>
