<template>
  <div class="flex w-full flex-col gap-4">
    <label class="bg-white px-1 text-lg font-semibold text-gray-700">
      工作坊時間
    </label>
    <VueTailwindDatepicker
      :key="`${dateModelValue.start} - ${dateModelValue.end}`"
      v-model="dateModelValue"
      :formatter="{ date: 'YYYY/MM/DD', month: 'MM' }"
      :disabled="disabled"
      use-range
      separator=" - "
      class="h-16 rounded-md"
      :input-classes="
        disabled
          ? 'border-gray-200 bg-slate-50'
          : 'border-gray-500 bg-transparent'
      "
    />
  </div>
</template>

<script setup lang="ts">
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { DateValue } from '@/types/workshop';

const emit = defineEmits<{
  (e: 'update:dateValue', dateValue: DateValue): void;
}>();

interface Props {
  dateValue: DateValue;
  disabled: boolean;
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
