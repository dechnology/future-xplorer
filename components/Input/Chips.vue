<template>
  <div class="flex flex-col gap-2">
    <InputLabel v-if="title">{{ title }}</InputLabel>
    <ul
      ref="ulRef"
      :class="!disabled && 'border border-solid border-gray-500'"
      class="flex min-h-[43.6px] items-center gap-2 rounded p-3 text-xs xl:min-h-[56px] xl:text-base"
      @click="handleClick"
    >
      <li
        v-for="(chip, idx) in chips"
        :key="`${idx}_${chip}`"
        :contenteditable="!disabled && idx === focusIndex"
        :class="` ${resultLiClasses}`"
        tabindex="-1"
        class="flex w-fit items-center gap-2 whitespace-nowrap rounded-2xl px-2 py-1 xl:px-3"
        @dblclick="(e) => handleDblClick(e, idx)"
        @keypress.enter.prevent="
          (e) => editChipsByIndex(idx, (e.target as HTMLLIElement).innerText)
        "
      >
        <span>
          {{ chip }}
        </span>
        <div
          v-if="!disabled && requiredIndex !== idx"
          class="flex h-full w-full items-center justify-center"
        >
          <Icon
            name="typcn:delete-outline"
            class="h-6 w-6 cursor-pointer"
            @click="() => handleRemove(idx)"
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
  requiredChip?: string;
  liClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  disabled: false,
  requiredChip: undefined,
  liClasses: '',
});

const emit = defineEmits<{
  (e: 'update:chips', chips: string[]): void;
}>();

const stores = {
  modal: useModalStore(),
};

const { ignoreNextClose } = storeToRefs(stores.modal);

const ulRef = ref<HTMLUListElement | null>(null);
const lastListItem = ref<HTMLLIElement | null>(null);
const focusIndex = ref<number | null>(null);
const requiredIndex = computed(() => {
  if (!props.requiredChip) {
    return null;
  }

  return props.chips.findIndex((chip) => chip === props.requiredChip);
});

const resultLiClasses = computed(() =>
  twMerge(
    'flex w-fit items-center gap-2 whitespace-nowrap rounded-2xl px-2 xl:px-3 xl:py-1',
    props.liClasses
  )
);

const handleClick = () => {
  if (!lastListItem.value || props.disabled) {
    return;
  }

  focusIndex.value = props.chips.length;
  lastListItem.value?.focus();
};

const handleRemove = (idx: number) => {
  if (props.disabled) {
    return;
  }

  // This line prevents the modal from closing in Keyword Sharing Tab.
  ignoreNextClose.value = true;
  deleteChipsByIndex(idx);
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
