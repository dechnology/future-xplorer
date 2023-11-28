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
            <StoryDetailsFormBody
              v-else-if="state === 'DETAILS' || state === 'EDITING'"
            />
            <StoryMultipleFormBody v-else />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions>
            <!-- <Icon
              v-if="state === 'NEW' || state === 'EDITING'"
              class="h-5 w-5 cursor-pointer text-blue-950 xl:h-6 xl:w-6"
              name="game-icons:rolling-dices"
              @click="handleDiceClick"
            /> -->
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel @search="handleSearch">
      <CardGallery :grid-cols="3">
        <Card
          :active="!activeStories"
          class="min-h-[200px] xl:min-h-[350px]"
          @click="() => (activeStories = [])"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增故事
          </CardIcon>
        </Card>
        <Card
          v-for="el in stories"
          :key="el._id"
          class="min-h-[200px] xl:min-h-[350px]"
          :active="activeIds.includes(el._id)"
          @dblclick="() => handleDblclick()"
          @click="() => stores.story.toggleActiveStory(el)"
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
import type { FormStateKey } from '@/types';

const ActionsComponents: Record<
  FormStateKey | 'MULTIPLE',
  ConcreteComponent | string
> = {
  NEW: resolveComponent('StoryNewActions'),
  DETAILS: resolveComponent('StoryDetailsActions'),
  EDITING: resolveComponent('StoryEditingActions'),
  MULTIPLE: resolveComponent('StoryMultipleActions'),
} as const;

const formPanelProps = {
  title: '情境故事',
  description:
    '第五步從一張張的情境故事(poems)中選擇一張或彙整出一張形成最終的未來情境文字描述(一句話)',
};

const { username, getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  persona: usePersonaStore(),
  keyword: useKeywordStore(),
  poemsTemplate: usePoemsTemplateStore(),
  story: useStoryStore(),
};
const {
  searchQuery,
  stories,
  currentContext,
  activeStories,
  activeIds,
  state,
  formCardProps,
} = storeToRefs(stores.story);

const handleDblclick = () => {
  stores.modal.show();
};

const handleDiceClick = () => {
  currentContext.value = stores.poemsTemplate.getRandomContext();
};

const handleSearch = async (value: string) => {
  searchQuery.value = value;

  const token = await getTokenSilently();
  stores.story.update(token);
};

onMounted(async () => {
  let token = await getTokenSilently();
  await Promise.all([stores.persona.init(token), stores.keyword.init(token)]);

  token = await getTokenSilently();
  await stores.poemsTemplate.init(token);

  token = await getTokenSilently();
  await stores.story.init(token);
});
</script>
