<template>
  <div class="grid grid-cols-2 gap-x-5 gap-y-7">
    <InputComponent
      v-model="currentStory.title"
      type="text"
      title="標題"
      placeholder="故事標題"
      :disabled="formDisabled"
    />
    <InputSelect
      v-model="currentPoemsTemplate"
      title="模板選擇"
      placeholder="模板套用"
      :disabled="formDisabled"
      :options="poemsTemplateOptions"
      @select="handleSelect"
    >
      <span v-if="currentPoemsTemplate">
        {{ currentPoemsTemplate.title }}
      </span>
    </InputSelect>
  </div>
  <InputSelect
    v-model="currentStory.context.persona"
    type="select"
    title="使用者 (P)"
    placeholder="故事使用者"
    :disabled="formDisabled"
    :options="personaOptions"
  >
    <span v-if="currentStory.context.persona">
      {{ currentStory.context.persona.trait }}的{{
        currentStory.context.persona.role
      }}
    </span>
  </InputSelect>
  <InputComponent
    v-model="currentStory.context.object"
    type="textarea"
    title="物件 (O)"
    placeholder="故事物件"
    :disabled="formDisabled"
    :select-options="keywordOptions.O"
    input-classes="h-[90px]"
  />
  <InputComponent
    v-model="currentStory.context.environment"
    type="textarea"
    title="環境 (E)"
    placeholder="故事環境"
    :disabled="formDisabled"
    :select-options="keywordOptions.E"
    input-classes="h-[90px]"
  />
  <InputComponent
    v-model="currentStory.context.message"
    type="textarea"
    title="訊息 (M)"
    placeholder="故事訊息"
    :disabled="formDisabled"
    input-classes="h-[90px]"
    :select-options="keywordOptions.M"
  />
  <InputComponent
    v-model="currentStory.context.service"
    type="textarea"
    title="服務 (S)"
    placeholder="故事服務"
    :disabled="formDisabled"
    input-classes="h-[90px]"
    :select-options="keywordOptions.S"
  />
  <div class="flex flex-col items-center">
    <CardButton
      class="rounded-lg bg-lime-500 px-8 py-3 text-white transition-all hover:bg-lime-700"
      @click.prevent="handleStoryGeneration"
    >
      AI組成故事
    </CardButton>
    <Icon
      name="material-symbols:double-arrow"
      size="4rem"
      class="rotate-90 text-stone-500"
    />
  </div>
</template>

<script setup lang="ts">
import type { PoemsTemplate } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
  story: useStoryStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { personaOptions, keywordOptions } = storeToRefs(stores.poemsTemplate);
const { currentStory, formDisabled, poemsTemplateOptions } = storeToRefs(
  stores.story
);

const currentPoemsTemplate = ref<PoemsTemplate>();

const handleSelect = (selected: PoemsTemplate | undefined) => {
  if (!selected) {
    return;
  }
  currentStory.value.context = { ...selected };
  currentStory.value.title = `${selected.title} 故事`;
};

const handleStoryGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    currentStory.value.title = currentStory.value.title.trim();
    if (currentStory.value.title === '') {
      throw new Error('no story title');
    }

    const token = await getTokenSilently();

    console.log('Generating story...');
    const { story } = await generateStory(token, {
      title: currentStory.value.title,
      workshop: workshop.value,
      issue: issue.value,
      ...currentStory.value.context,
    });

    currentStory.value.content = story;
  } catch (e) {
    console.error(e);
  }
};
</script>
