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
            <StoryTemplateFormBody v-if="state === 'NEW'" />
            <StoryDetailsFormBody v-else />
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
              @click="handleDiceClick"
            />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel v-slot="slotProps">
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
          v-for="el in stories.filter((el) =>
            [el.title, el.content].join().includes(slotProps.searchQuery)
          )"
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
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys } from '@/types';

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

const { username } = useAuth();
const stores = {
  modal: useModalStore(),
  poemsTemplate: usePoemsTemplateStore(),
  story: useStoryStore(),
};
const {
  stories,
  activeStory,
  activeId,
  currentStory,
  state,
  formCardProps,
  formDisabled,
} = storeToRefs(stores.story);

const handleDblclick = () => {
  stores.modal.show();
};

const handleDiceClick = () => {
  currentStory.value.context = stores.poemsTemplate.getRandomContext();
};
</script>
