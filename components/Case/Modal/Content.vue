<template>
  <div
    v-if="activeCase"
    ref="contentDiv"
    class="relative flex min-h-0 shrink grow basis-auto flex-col gap-6 overflow-y-auto"
  >
    <div class="flex flex-col gap-6" @mouseup.prevent="handleMouseup">
      <slot :content="activeCaseContent" />
      <span
        ref="selectedTextMeasure"
        style="position: absolute; visibility: hidden; white-space: nowrap"
        >{{ selectedText }}</span
      >
      <span
        ref="selectedMaxTextMeasure"
        style="position: absolute; top: 0; left: -9999px; white-space: nowrap"
      >
        題與挑戰題與挑戰題與挑戰題與挑戰題與
      </span>
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
        :class="buttonClass"
        :disabled="isTextTooLong"
        @click.prevent="handleButtonClick"
      >
        {{ buttonText }}
      </CardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod';
import type { Keyword } from '@/types';

interface CaseContent {
  背景介紹: string;
  作法: string;
  目標: string;
  問題與挑戰: string;
  成果: string;
  其他: string;
  參考資料: string;
}

const emit = defineEmits<{
  (e: 'keywordCreation'): void;
}>();

const { getTokenSilently } = useAuth();

const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};
const { activeCase, activeId } = storeToRefs(stores.case);
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
const selectedTextMeasure = ref<HTMLSpanElement | null>(null);
const selectedMaxTextMeasure = ref<HTMLSpanElement | null>(null);

const buttonDivPosition = ref({ top: 0, left: 0 });
const buttonDivStyle = computed(() => ({
  top: `${buttonDivPosition.value.top}px`,
  left: `${buttonDivPosition.value.left}px`,
}));

const isTextTooLong = ref(false);
const checkTextInvalid = () => {
  nextTick(() => {
    const MAX_TEXT_PIXELS = selectedMaxTextMeasure.value?.offsetWidth ?? 0;
    const width = selectedTextMeasure.value?.offsetWidth ?? 0;
    if (width > MAX_TEXT_PIXELS) {
      console.log(`字寬大於 ${MAX_TEXT_PIXELS} 個像素`);
      isTextTooLong.value = true;
      return true;
    } else {
      console.log(`字寬小於等於 ${MAX_TEXT_PIXELS} 個像素`);
      isTextTooLong.value = false;
      return false;
    }
  });
};
const buttonText = computed(() =>
  isTextTooLong.value
    ? `關鍵字太長了，放不進卡牌內(大約18個中文字)`
    : '新增關鍵字'
);

const buttonClass = computed(() =>
  isTextTooLong.value
    ? 'bg-gray-400 hover:bg-gray-400'
    : 'bg-blue-400 hover:bg-blue-500'
);

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
  checkTextInvalid();
};

const handleButtonClick = async () => {
  try {
    if (isTextTooLong.value) {
      throw new Error('Text too long');
    }

    const el = z.string().nonempty().parse(selectedText.value);

    const token = await getTokenSilently();
    const { data } = await fetchResources<Keyword>(
      token,
      `/api/cases/${activeId.value}/keywords`,
      {
        method: 'post',
        body: { keywords: [el] },
      }
    );
    console.log('Created: ', data);

    emit('keywordCreation');
  } catch (e) {
    console.error(e);
  }
  ignoreNextClose.value = true;
  selectedText.value = null;
};
</script>
