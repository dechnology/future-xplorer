<template>
  <div class="m-auto flex w-1/3 items-center justify-center gap-8">
    <InputDatePicker v-model:date-value="dates" />
    <button
      @click="
        () => {
          console.log(dates);
        }
      "
      class="text rounded-md bg-blue-300 p-4 text-white"
    >
      Show dates
    </button>
  </div>
</template>

<script setup lang="ts">
const dates = ref<{ start: string; end: string }>({
  start: '2000/10/07',
  end: '2023/08/14',
});
</script>
