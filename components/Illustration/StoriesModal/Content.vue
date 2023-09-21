<template>
  <div
    v-if="activeCase"
    ref="contentDiv"
    class="relative flex min-h-0 shrink grow basis-auto flex-col gap-6 overflow-y-auto"
  >
    <div class="flex flex-col gap-6" @mouseup.prevent="handleMouseup">
      <slot :content="activeCaseContent" />
    </div>

    <div>
      <div class="overflow-hidden rounded-lg">
        <NuxtImg v-if="activeCase.image" :src="activeCase.image" alt="" />
      </div>
    </div>
    <div
      ref="buttonDiv"
      class="absolute z-50"
      :class="!selectedText && 'hidden'"
      :style="buttonDivStyle"
    >
      <CardButton
        class="h-12 rounded-lg bg-blue-400 px-3 text-white hover:bg-blue-500"
        @click.prevent="handleButtonClick"
      >
        新增關鍵字
      </CardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NewKeywordSchema } from '@/types';

interface CaseContent {
  背景介紹: string;
  作法: string;
  目標: string;
  問題與挑戰: string;
  成果: string;
  其他: string;
  參考資料: string;
}

const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};
const { activeCase, newKeywords } = storeToRefs(stores.case);
const { ignoreNextClose } = storeToRefs(stores.modal);

const textSelectionState = useTextSelection();

const activeCaseContent = computed(
  (): CaseContent =>
    activeCase.value
      ? {
          背景介紹: activeCase.value.background,
          作法: activeCase.value.method,
          目標: activeCase.value.goal,
          問題與挑戰: activeCase.value.challenge,
          成果: activeCase.value.result,
          其他: activeCase.value.other,
          參考資料: activeCase.value.reference,
        }
      : {
          背景介紹: '',
          作法: '',
          目標: '',
          問題與挑戰: '',
          成果: '',
          其他: '',
          參考資料: '',
        }
);

const contentDiv = ref<HTMLDivElement | null>(null);
const buttonDiv = ref<HTMLDivElement | null>(null);
const selectedText = ref<string | null>(null);
const ignoreClick = ref(false);

const buttonDivPosition = ref({ top: 0, left: 0 });
const buttonDivStyle = computed(() => ({
  top: `${buttonDivPosition.value.top}px`,
  left: `${buttonDivPosition.value.left}px`,
}));

onClickOutside(buttonDiv, (e: PointerEvent) => {
  if (ignoreClick.value) {
    ignoreClick.value = false;
    return;
  }
  if (
    selectedText.value &&
    buttonDiv.value &&
    !buttonDiv.value.contains(e.target as Node)
  ) {
    console.log('setting selected text to null');
    selectedText.value = null;
  }
});

const handleMouseup = () => {
  if (!(textSelectionState.text.value && contentDiv.value)) {
    return;
  }

  const contentDivRect = contentDiv.value.getBoundingClientRect();
  const contentDivScrollY = contentDiv.value.scrollTop;
  const rangeRect = textSelectionState.ranges.value[0].getBoundingClientRect();

  console.log('scrollY: ', contentDivScrollY);

  let top = Math.round(
    rangeRect.top - contentDivRect.top - 48 - 4 + contentDivScrollY
  );

  if (top < contentDivScrollY) {
    top = Math.round(
      rangeRect.top - contentDivRect.top + 24 + 4 + contentDivScrollY
    );
  }

  buttonDivPosition.value = {
    top,
    left: Math.round(
      rangeRect.left - contentDivRect.left + rangeRect.width / 2
    ),
  };

  console.log(buttonDivPosition.value);

  selectedText.value = textSelectionState.text.value;
  ignoreClick.value = true;
};

const handleButtonClick = () => {
  try {
    const k = NewKeywordSchema.parse({ body: selectedText.value });
    newKeywords.value.unshift(k);
  } catch (e) {
    console.error(e);
  }
  ignoreNextClose.value = true;
  selectedText.value = null;
};
</script>
