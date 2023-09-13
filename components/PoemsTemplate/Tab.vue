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
              v-model="currentPoemsTemplate.title"
              type="text"
              title="標題"
              placeholder="模板標題"
              :disabled="formDisabled"
            />
            <InputSelect
              v-slot="slotProps"
              v-model="currentPoemsTemplate.persona"
              type="select"
              title="使用者 (P)"
              placeholder="模板使用者"
              :disabled="formDisabled"
              :options="
                personas.map((el) => ({
                  name: `${el.trait}的${el.role}(${el.name})`,
                  data: el,
                }))
              "
            >
              <span v-if="slotProps.selected && slotProps.selected.data">
                {{ slotProps.selected.data.trait }}的{{
                  slotProps.selected.data.role
                }}
              </span>
            </InputSelect>
            <InputComponent
              v-model="currentPoemsTemplate.object"
              type="textarea"
              title="物件 (O)"
              placeholder="模板物件"
              :disabled="formDisabled"
              :select-options="
                votedKeywords
                  .filter((el) => el.type === 'O')
                  .map((el) => ({ name: el.body, data: el.body }))
              "
              input-classes="h-[90px]"
            />
            <InputComponent
              v-model="currentPoemsTemplate.environment"
              type="textarea"
              title="環境 (E)"
              placeholder="模板環境"
              :disabled="formDisabled"
              :select-options="
                votedKeywords
                  .filter((el) => el.type === 'E')
                  .map((el) => ({ name: el.body, data: el.body }))
              "
              input-classes="h-[90px]"
            />
            <InputComponent
              v-model="currentPoemsTemplate.message"
              type="textarea"
              title="訊息 (M)"
              placeholder="模板訊息"
              :disabled="formDisabled"
              input-classes="h-[90px]"
              :select-options="
                votedKeywords
                  .filter((el) => el.type === 'M')
                  .map((el) => ({ name: el.body, data: el.body }))
              "
            />
            <InputComponent
              v-model="currentPoemsTemplate.service"
              type="textarea"
              title="服務 (S)"
              placeholder="模板服務"
              :disabled="formDisabled"
              input-classes="h-[90px]"
              :select-options="
                votedKeywords
                  .filter((el) => el.type === 'S')
                  .map((el) => ({ name: el.body, data: el.body }))
              "
            />
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery :grid-cols="3">
        <Card
          class="h-[350px]"
          :active="!activePoemsTemplate"
          @click="() => stores.poemsTemplate.changeActivePoemsTemplate()"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增模板
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in poemsTemplates"
          :key="el._id"
          class="h-[350px]"
          :active="activeId === el._id"
          @dblclick="() => handleDblclick()"
          @click="() => stores.poemsTemplate.changeActivePoemsTemplate(el)"
        >
          <CardTitle>{{ el.title }}</CardTitle>
          <CardDescription>
            {{
              [
                `P: ${el.persona.trait}的${el.persona.role}`,
                `O: ${el.object}`,
                `E: ${el.environment}`,
                `S: ${el.service}`,
              ].join('\n\n')
            }}
          </CardDescription>
          <CardFootnote>
            {{ `建立者：${el.creator.name}` }}
          </CardFootnote>
        </Card>
        <!-- Should be async component (end) -->
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
  title: 'POEMS 模板',
  description: '第四步將前三步所得之資料組合成一張張的情境故事(poems)',
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