<template>
  <div
    ref="contentDiv"
    class="relative flex shrink grow basis-auto flex-col gap-6 overflow-y-auto"
    v-if="activeCase"
  >
    <div v-for="(content, title) in activeCaseContent">
      <p>
        <span class="text-base font-semibold text-gray-700">{{ title }}：</span>
        <span @mouseup="handleMouseup">
          {{ content }}
        </span>
      </p>
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
        @click.prevent="handleClick"
        class="h-12 rounded-lg bg-blue-400 text-white hover:bg-blue-500"
        body="新增關鍵字"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Keyword, NewKeywordSchema } from '@/types';

interface CaseContent {
  背景介紹: string;
  作法: string;
  目標: string;
  問題與挑戰: string;
  成果: string;
  其他: string;
  參考資料: string;
}

const cardStore = useCaseCardStore();
const modalStore = useModalStore();
const keywordStore = useKeywordStore();
const { activeCase, activeId, activeCaseKeywords } = storeToRefs(cardStore);
const { ignoreNextClose } = storeToRefs(modalStore);

const contentDiv = ref<HTMLDivElement | null>(null);
const buttonDiv = ref<HTMLDivElement | null>(null);
const selectedText = ref<string | null>(null);
const ignoreClick = ref(false);

const buttonDivPosition = ref({ top: 0, left: 0 });
const buttonDivStyle = computed(() => ({
  top: `${buttonDivPosition.value.top}px`,
  left: `${buttonDivPosition.value.left}px`,
}));

const activeCaseContent = computed((): CaseContent | null => {
  if (!activeCase.value) {
    return null;
  }
  const { background, method, goal, challenge, result, other, reference } =
    activeCase.value;
  return {
    背景介紹: background,
    作法: method,
    目標: goal,
    問題與挑戰: challenge,
    成果: result,
    其他: other,
    參考資料: reference,
  };
});

const handleMouseup = (e: Event) => {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) {
    return;
  }

  const range = selection.getRangeAt(0);
  if (range.startContainer !== range.endContainer) {
    return;
  }

  if (!contentDiv.value) {
    return;
  }

  const contentDivRect = contentDiv.value.getBoundingClientRect();
  const contentDivScrollY = contentDiv.value.scrollTop;
  const rangeRect = range.getBoundingClientRect();

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

  selectedText.value = selection.toString();
  ignoreClick.value = true;
};

const handleClick = async (e: Event) => {
  try {
    const k = NewKeywordSchema.parse({ body: selectedText.value });
    keywordStore.append(k);
  } catch (e) {
    console.error(e);
  }

  ignoreNextClose.value = true;
  selectedText.value = null;
};

const handleNonButtonClick = (e: Event) => {
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
};

onMounted(() => {
  window.addEventListener('click', handleNonButtonClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleNonButtonClick);
});
</script>
