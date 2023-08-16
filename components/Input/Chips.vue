<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="title"
      class="bg-transparent px-1 text-lg font-semibold text-gray-700"
    >
      {{ title }}
    </label>
    <ul
      ref="ulRef"
      :class="disabled ? 'border-gray-200 bg-gray-50' : 'border-gray-500'"
      class="flex h-20 items-center gap-2 rounded border border-solid p-4"
    >
      <li
        v-for="(chip, idx) in chips"
        :key="`${idx}_${chip}`"
        @dblclick="(e) => handleDblClick(e, idx)"
        @keypress.enter.prevent="
          (e) => editChipsByIndex(idx, (e.target as HTMLLIElement).innerText)
        "
        :contenteditable="!disabled && idx === focusIndex"
        tabindex="-1"
        class="flex w-fit items-center gap-2 whitespace-nowrap rounded-2xl px-3 py-1"
        :class="idx === focusIndex ? 'bg-slate-300' : 'bg-slate-200'"
      >
        <span>
          {{ chip }}
        </span>
        <Icon
          v-if="!disabled"
          @click="() => !disabled && deleteChipsByIndex(idx)"
          name="typcn:delete-outline"
          size="2rem"
        />
      </li>
      <div @click="handleClick" class="flex h-full w-full items-center">
        <li
          ref="lastListItem"
          :contenteditable="!disabled && chips.length === focusIndex"
          @keypress.enter.prevent="
            (e) => appendChip((e.target as HTMLLIElement).innerText)
          "
          tabindex="0"
          class="flex-1 align-middle focus:outline-none"
        ></li>
      </div>
    </ul>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  chips: string[];
  disabled: boolean;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:chips', chips: string[]): void;
}>();

const ulRef = ref<HTMLUListElement | null>(null);
const focusIndex = ref<number | null>(null);
const lastListItem = ref<HTMLLIElement | null>(null);

const handleClick = (e: MouseEvent) => {
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
