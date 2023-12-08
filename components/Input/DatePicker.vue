<template>
  <div class="flex w-full flex-col gap-4">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <VueTailwindDatepicker
      :key="`${dateModelValue.start} - ${dateModelValue.end}`"
      v-model="dateModelValue"
      :formatter="{ date: 'YYYY/MM/DD', month: 'MM' }"
      :disabled="disabled"
      use-range
      separator=" - "
      class="rounded-md text-xs xl:text-base"
      :input-classes="
        disabled ? 'border-none' : 'border-gray-500 bg-transparent'
      "
    />
  </div>
</template>

<script setup lang="ts">
import VueTailwindDatepicker from 'vue-tailwind-datepicker';
import { DateValue } from '@/types/workshop';

interface Props {
  title?: string;
  dateValue: DateValue;
  disabled: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:dateValue', dateValue: DateValue): void;
}>();

const dateModelValue = computed({
  get() {
    return props.dateValue;
  },
  set(newDateValue) {
    emit('update:dateValue', newDateValue);
  },
});
</script>
