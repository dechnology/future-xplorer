<template>
  <div class="relative pb-3">
    <input
      type="range"
      v-bind="inputProps"
      list="markers"
      @change="
        (e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)
      "
    />
    <datalist
      id="markers"
      class="absolute bottom-0 flex w-full justify-between p-1"
    >
      <option
        v-for="m in markers"
        :key="m"
        :value="m"
        :label="m.toString()"
        class="text-xs"
      ></option>
    </datalist>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  selectOnly: false,
  readOnly: false,
});

defineEmits<{
  (e: 'update:modelValue', num: number): void;
}>();

const markers = computed(() => {
  const result: number[] = [];
  for (let i = props.min; i <= props.max; i += props.step) {
    result.push(i);
  }
  return result;
});

const inputProps = computed(() => {
  return {
    class: twMerge(
      ['w-full', 'rounded', 'border', 'border-solid', 'border-black'],
      props.type === 'textarea' && 'resize-none',
      props.disabled ? ['bg-slate-50'] : ['border-opacity-40']
    ),
    disabled: props.disabled,
    value: props.modelValue,
    min: props.min,
    max: props.max,
    step: props.step,
  };
});
</script>
