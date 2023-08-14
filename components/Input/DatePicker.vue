<template>
  <div class="flex w-full flex-col gap-4">
    <label
      for="duration"
      class="bg-white px-1 text-lg font-semibold text-gray-700"
    >
      工作坊時間
    </label>
    <VueTailwindDatepicker
      v-model="dateModelValue"
      use-range
      :formatter="{ date: 'YYYY/MM/DD', month: 'MM' }"
      separator=" - "
      class="h-16 rounded-md bg-transparent"
    />
  </div>
</template>

<script setup lang="ts">
import VueTailwindDatepicker, {
  DatepickerProps,
} from 'vue-tailwind-datepicker';

const emit = defineEmits<{
  (e: 'update:dateValue', dateValue: { start: string; end: string }): void;
}>();

interface Props {
  dateValue: { start: string; end: string };
}

const props = defineProps<Props>();

const dateModelValue = computed({
  get() {
    return props.dateValue;
  },
  set(newDateValue) {
    emit('update:dateValue', newDateValue);
  },
});
</script>
