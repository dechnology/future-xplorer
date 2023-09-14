<template>
  <NuxtLayout>
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
          </PanelHeader>
        </template>
        <FormCard>
          <template #body>
            <CardButton
              class="mx-auto w-fit rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
              @click.prevent="handleImageGeneration"
            >
              選擇故事
            </CardButton>
            <InputComponent
              v-model="currentStory.content"
              type="textarea"
              title="故事內容"
              placeholder="故事內容"
              :disabled="formDisabled"
              input-classes="h-[200px]"
            />
            <div class="flex flex-col items-center">
              <CardButton
                class="rounded-lg bg-lime-600 px-8 py-3 text-white transition-all hover:bg-lime-700"
                body="Prompt"
                @click.prevent="handleImageGeneration"
              >
                <span>PROMPT</span>
                <Icon
                  name="material-symbols:double-arrow"
                  size="2.5rem"
                  class="rotate-90"
                />
              </CardButton>
            </div>
            <InputComponent
              v-model="currentStory.content"
              type="textarea"
              title="Prompt"
              placeholder="情境圖 prompt"
              :disabled="formDisabled"
              input-classes="h-[200px]"
            />
            <CardButton
              class="mx-auto w-fit rounded-lg bg-indigo-500 px-8 py-3 text-white transition-all hover:bg-indigo-600"
              @click.prevent="handleImageGeneration"
            >
              情境圖生成
            </CardButton>
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery :grid-cols="3">
        <Card
          :active="!activeStory"
          class="h-[350px]"
          @click="() => stores.story.changeActiveStory()"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增故事
          </CardIcon>
        </Card>
        <Card
          v-for="el in stories"
          :key="el._id"
          class="h-[350px]"
          :active="activeId === el._id"
          @dblclick="() => handleDblclick()"
          @click="() => stores.story.changeActiveStory(el)"
        >
          <CardTitle>{{ el.title }}</CardTitle>
          <CardDescription>{{ el.content }}</CardDescription>
          <CardFootnote>{{ `建立者：${el.creator.name}` }}</CardFootnote>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { fakerZH_TW } from '@faker-js/faker';
import type { NewPersona, PoemsTemplate } from '@/types';

const formPanelProps = {
  title: '情境圖',
  description:
    '第五步從一張張的情境故事(poems)中選擇一張或彙整出一張形成最終的未來情境文字描述(一句話)',
};

const { user, username, userId, getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  issue: useIssueStore(),
  persona: usePersonaStore(),
  keyword: useKeywordStore(),
  poemsTemplate: usePoemsTemplateStore(),
  story: useStoryStore(),
};
const { personas } = storeToRefs(stores.persona);
const { categoriedVotedKeywords } = storeToRefs(stores.keyword);
const { poemsTemplates } = storeToRefs(stores.poemsTemplate);
const {
  loading,
  stories,
  activeStory,
  activeId,
  currentStory,
  state,
  formCardProps,
  formDisabled,
} = storeToRefs(stores.story);

const currentPoemsTemplate = ref<PoemsTemplate>();

const personaOptions = computed(() =>
  personas.value.map((el): Omit<NewPersona, 'image'> => {
    const { name, age, gender, role, trait, other, ..._ } = el;
    return {
      name,
      age,
      gender,
      role,
      trait,
      other,
    };
  })
);

const randomizeContext = () => {
  currentStory.value.context = {
    persona: fakerZH_TW.helpers.arrayElement(personaOptions.value),
    object: fakerZH_TW.helpers.arrayElement(categoriedVotedKeywords.value.O),
    environment: fakerZH_TW.helpers.arrayElement(
      categoriedVotedKeywords.value.E
    ),
    message: fakerZH_TW.helpers.arrayElement(categoriedVotedKeywords.value.M),
    service: fakerZH_TW.helpers.arrayElement(categoriedVotedKeywords.value.S),
  };
};

const handleImageGeneration = async () => {};

const handleDblclick = () => {
  stores.modal.show();
};
</script>
