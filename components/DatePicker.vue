<template>
  <vue-tailwind-datepicker v-bind="props" v-model="dateValue" />
</template>

<script setup lang="ts">
import VueTailwindDatepicker, {
  DatepickerProps,
} from 'vue-tailwind-datepicker';

const props = defineProps<DatepickerProps>();

const dateValue = ref<
  | [Date, Date]
  | { start: Date | string; end: Date | string }
  | {
      startDate: Date | string;
      endDate: Date | string;
    }
  | string
>('');
</script>
