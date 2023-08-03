<template>
  <NuxtLayout>
    <template #detail-pane>
      <h2 class="mb-5 text-3xl font-bold">議題列表</h2>
      <p class="mb-7 text-base">
        第一步需先決定整體研究的核心主題為何，後續的所有情境都會需在這個主題架構下。
      </p>
      <IssueDetailedCard />
    </template>
    <div class="flex flex-col gap-6">
      <div class="flex items-center gap-6">
        <Icon size="1.25rem" name="mdi:arrow-left" />
        <span>返回</span>
      </div>
      <div class="grid grid-cols-4 gap-4">
        <IssueCard v-for="issue in issues" :issue="issue" />
      </div>
    </div>
    <!-- ISSUES -->
  </NuxtLayout>
</template>

<script setup lang="ts">
import { Issue } from '@/types/issue';

const issues = Array.from({ length: 10 }, (_, idx) => {
  return idx === 0
    ? null
    : ({
        id: idx,
        title: '智慧健康生活探詢',
        description:
          'Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim. Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim. Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.Nostrud veniam commodo reprehenderit minim duis labore irure sit do dolore eu proident enim.',
        creator: 'HEHE',
        createdAt: new Date(2000, 10, 7),
        updatedAt: new Date(),
      } as Issue);
}) as (Issue | null)[];
</script>
