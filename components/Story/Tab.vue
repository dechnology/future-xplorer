<template>
  <NuxtLayout left-basis="50%" right-basis="50%">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
          </PanelHeader>
        </template>
        <FormCard v-bind="formCardProps" :username="username">
          <template #body>
            <div class="grid grid-cols-2 gap-x-5 gap-y-7">
              <InputComponent
                v-model="currentStory.title"
                type="text"
                title="標題"
                placeholder="故事標題"
                :disabled="formDisabled"
              />
              <InputSelect
                v-slot="slotProps"
                v-model="currentPoemsTemplate"
                title="模板選擇"
                placeholder="模板套用"
                :disabled="formDisabled"
                :options="
                  poemsTemplates.map((el) => ({
                    name: el.title,
                    data: el,
                  }))
                "
              >
                <span v-if="slotProps.selected">
                  {{ slotProps.selected.name }}
                </span>
              </InputSelect>
            </div>
            <InputSelect
              v-model="currentStory.context.persona"
              type="select"
              title="使用者 (P)"
              placeholder="故事使用者"
              :disabled="formDisabled"
              :options="
                personaOptions.map((el) => ({
                  name: `${el.trait}的${el.role} (${el.name})`,
                  data: el,
                }))
              "
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
              :select-options="
                categoriedVotedKeywords.O.map((el) => ({ name: el, data: el }))
              "
              input-classes="h-[90px]"
            />
            <InputComponent
              v-model="currentStory.context.environment"
              type="textarea"
              title="環境 (E)"
              placeholder="故事環境"
              :disabled="formDisabled"
              :select-options="
                categoriedVotedKeywords.E.map((el) => ({ name: el, data: el }))
              "
              input-classes="h-[90px]"
            />
            <InputComponent
              v-model="currentStory.context.message"
              type="textarea"
              title="訊息 (M)"
              placeholder="故事訊息"
              :disabled="formDisabled"
              input-classes="h-[90px]"
              :select-options="
                categoriedVotedKeywords.M.map((el) => ({ name: el, data: el }))
              "
            />
            <InputComponent
              v-model="currentStory.context.service"
              type="textarea"
              title="服務 (S)"
              placeholder="故事服務"
              :disabled="formDisabled"
              input-classes="h-[90px]"
              :select-options="
                categoriedVotedKeywords.S.map((el) => ({ name: el, data: el }))
              "
            />
            <div class="flex flex-col items-center">
              <CardButton
                class="rounded-lg bg-lime-600 px-8 py-3 text-white transition-all hover:bg-lime-700"
                body="AI組成故事"
                @click.prevent="handleStoryGeneration"
              />
              <Icon
                name="material-symbols:double-arrow"
                size="4rem"
                class="rotate-90 text-stone-500"
              />
            </div>
            <InputComponent
              v-model="currentStory.content"
              type="textarea"
              title="故事內容"
              placeholder="故事內容"
              :disabled="formDisabled"
              input-classes="h-[200px]"
            />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions>
            <Icon
              v-if="state !== 'DETAILS'"
              class="cursor-pointer text-blue-950"
              name="game-icons:rolling-dices"
              size="1.75rem"
              @click="() => randomizeContext()"
            />
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
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys, NewPersona, PoemsTemplate } from '@/types';

const ActionsComponents: Record<FormStateKeys, ConcreteComponent | string> = {
  NEW: resolveComponent('StoryNewActions'),
  DETAILS: resolveComponent('StoryDetailsActions'),
  EDITING: resolveComponent('StoryEditingActions'),
} as const;

const formPanelProps = {
  title: '情境故事',
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

const handleStoryGeneration = async () => {};

const handleDblclick = () => {
  stores.modal.show();
};
</script>
