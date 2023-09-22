<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <ul
      ref="ulRef"
      :class="disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-500'"
      class="flex min-h-[56px] items-center gap-2 rounded border border-solid p-3"
      @click="handleClick"
    >
      <li
        v-for="(chip, idx) in chips"
        :key="`${idx}_${chip}`"
        :contenteditable="!disabled && idx === focusIndex"
        :class="idx === focusIndex ? 'bg-slate-300' : 'bg-slate-200'"
        tabindex="-1"
        class="flex w-fit items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-1"
        @dblclick="(e) => handleDblClick(e, idx)"
        @keypress.enter.prevent="
          (e) => editChipsByIndex(idx, (e.target as HTMLLIElement).innerText)
        "
      >
        <span>
          {{ chip }}
        </span>
        <div v-if="!disabled">
          <Icon
            name="typcn:delete-outline"
            size="2rem"
            @click="() => !disabled && deleteChipsByIndex(idx)"
          />
        </div>
      </li>
      <li
        ref="lastListItem"
        :contenteditable="!disabled && chips.length === focusIndex"
        tabindex="0"
        class="shrink grow basis-auto align-middle focus:outline-none"
        @keypress.enter.prevent="
          (e) => appendChip((e.target as HTMLLIElement).innerText)
        "
      ></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  chips: string[];
  title?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), { disabled: false });

const emit = defineEmits<{
  (e: 'update:chips', chips: string[]): void;
}>();

const ulRef = ref<HTMLUListElement | null>(null);
const lastListItem = ref<HTMLLIElement | null>(null);
const focusIndex = ref<number | null>(null);

const handleClick = () => {
  if (!lastListItem.value) {
    return;
  }

  focusIndex.value = props.chips.length;
  lastListItem.value?.focus();
};

const editChipsByIndex = (idx: number, chip: string) => {
  if (!lastListItem.value) {
    return;
  }

  const editedChips = [...props.chips];
  editedChips[idx] = chip;
  emit('update:chips', editedChips);
  focusIndex.value = null;
};

const deleteChipsByIndex = (idx: number) => {
  if (!lastListItem.value) {
    return;
  }

  const deletedChips = [...props.chips];
  deletedChips.splice(idx, 1);
  emit('update:chips', deletedChips);
};

const appendChip = (chip: string) => {
  if (!lastListItem.value) {
    return;
  }

  emit('update:chips', [...props.chips, chip]);
  lastListItem.value.innerText = ' ';
  nextTick().then(() => {
    console.log(props.chips);
    console.log(lastListItem.value);

    focusIndex.value = props.chips.length;
    lastListItem.value?.focus();
  });
};

const handleDblClick = (e: Event, idx: number) => {
  if (props.disabled) {
    return;
  }
  focusIndex.value = idx;
  (e.target as HTMLLIElement).focus();
};

const handleOutsideClick = (e: MouseEvent) => {
  if (ulRef.value && !ulRef.value.contains(e.target as Node)) {
    focusIndex.value = null;
  }
};

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>
