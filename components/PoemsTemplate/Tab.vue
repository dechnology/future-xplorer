<template>
  <NuxtLayout left-basis="40%" right-basis="60%">
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
            <InputComponent
              type="text"
              title="標題"
              placeholder="模板標題"
              :disabled="formDisabled"
              v-model="currentPoemsTemplate.title"
            />
            <!-- <InputComponent
                type="textarea"
                title="姓名"
                placeholder="姓名"
                input-classes="h-[90px]"
                :disabled="formDisabled"
                v-model="currentPoemsTemplate.persona"
              /> -->
            <InputComponent
              type="textarea"
              title="物件 (O)"
              placeholder="模板物件"
              input-classes="h-[90px]"
              :disabled="formDisabled"
              :select-options="[...PersonaPresets.age]"
              v-model="currentPoemsTemplate.object"
            />
            <InputComponent
              type="textarea"
              title="環境 (E)"
              placeholder="模板環境"
              input-classes="h-[90px]"
              :disabled="formDisabled"
              :select-options="[...PersonaPresets.gender]"
              v-model="currentPoemsTemplate.environment"
              select-only
            />
            <InputComponent
              type="textarea"
              title="訊息 (M)"
              placeholder="模板訊息"
              input-classes="h-[90px]"
              :disabled="formDisabled"
              :select-options="[...PersonaPresets.trait]"
              v-model="currentPoemsTemplate.message"
            />
            <InputComponent
              type="textarea"
              title="服務 (S)"
              placeholder="模板服務"
              input-classes="h-[90px]"
              :disabled="formDisabled"
              v-model="currentPoemsTemplate.service"
            />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    test
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
  title: 'POEMS 模板',
  description: '第四步將前三步所得之資料組合成一張張的情境故事(poems)',
};

const { user, username, userId, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { elementsArray } = storeToRefs(stores.issue);
const {
  loading,
  poemsTemplates,
  currentPoemsTemplate,
  state,
  formCardProps,
  formDisabled,
} = storeToRefs(stores.poemsTemplate);
</script>
