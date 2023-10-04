<template>
  <WorkshopTableRow v-for="i in nRows" :key="i" classes="animate-pulse" active>
  </WorkshopTableRow>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ nRows: number }>(), { nRows: 5 });
</script>
