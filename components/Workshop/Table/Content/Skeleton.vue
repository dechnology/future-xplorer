<template>
  <WorkshopTableRow>
    <WorkshopTableData> </WorkshopTableData>
  </WorkshopTableRow>
</template>

<script setup lang="ts">
const { nRows = 5 } = defineProps<{ nRows: number }>();
</script>
