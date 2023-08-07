<template>
  <tr>
    <td class="py-6">
      <div class="flex items-center justify-center">
        {{ workshop.name }}
      </div>
    </td>
    <td class="py-6">
      <div class="flex items-center justify-center">
        {{ formatDate(workshop.startAt, 'yyyy/MM/dd') }} -
        {{ formatDate(workshop.endAt, 'yyyy/MM/dd') }}
      </div>
    </td>
    <td class="py-6">
      <div class="flex items-center justify-center">
        {{ workshop.creator }}
      </div>
    </td>
    <td class="py-6">
      <div class="flex items-center justify-center">
        {{ formatDate(workshop.createdAt) }}
      </div>
    </td>
    <td class="py-6">
      <div class="flex items-center justify-center">
        {{ formatDate(workshop.updatedAt) }}
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { Workshop } from '@/types/workshop';

interface Props {
  workshop: Workshop;
}
const props = defineProps<Props>();
</script>
