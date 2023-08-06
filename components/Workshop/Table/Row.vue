<template>
  <tr v-if="workshop === null">
    <td class="py-4" colspan="5">
      <div class="flex items-center justify-center">
        <Icon name="mdi:plus-circle-outline" size="3rem" />
      </div>
    </td>
  </tr>
  <tr
    v-else
    @click="
      () => {
        $router.push(`/workshop/${workshop?.id}`);
      }
    "
  >
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
  workshop: Workshop | null;
}
const props = defineProps<Props>();
</script>
