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
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery :grid-cols="3">
        <Card
          :active="!activePoemsTemplate"
          @click="() => stores.poemsTemplate.changeActivePoemsTemplate()"
          class="h-[350px]"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增故事
          </CardIcon>
        </Card>
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import { FormStateKeys } from '@/types';

const ActionsComponents: Record<FormStateKeys, ConcreteComponent | string> = {
  NEW: resolveComponent('PoemsTemplateNewActions'),
  DETAILS: resolveComponent('PoemsTemplateDetailsActions'),
  EDITING: resolveComponent('PoemsTemplateEditingActions'),
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
};
const { personas } = storeToRefs(stores.persona);
const { votedKeywords } = storeToRefs(stores.keyword);
const {
  loading,
  poemsTemplates,
  activePoemsTemplate,
  activeId,
  currentPoemsTemplate,
  state,
  formCardProps,
  formDisabled,
} = storeToRefs(stores.poemsTemplate);

const handleDblclick = () => {
  stores.modal.show();
};
</script>
