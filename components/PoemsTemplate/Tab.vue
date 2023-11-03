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
              v-model="currentPoemsTemplate.persona"
              type="select"
              title="使用者 (P)"
              placeholder="模板使用者"
              :disabled="formDisabled"
              :options="personaOptions"
            >
              <span v-if="currentPoemsTemplate.persona">
                {{ currentPoemsTemplate.persona.trait }}的{{
                  currentPoemsTemplate.persona.role
                }}
              </span>
            </InputSelect>
            <InputComponent
              v-model="currentPoemsTemplate.object"
              type="textarea"
              title="物件 (O)"
              placeholder="模板物件"
              :disabled="formDisabled"
              :select-options="keywordOptions.O"
              input-classes="h-16 xl:h-[90px]"
            />
            <InputComponent
              v-model="currentPoemsTemplate.environment"
              type="textarea"
              title="環境 (E)"
              placeholder="模板環境"
              :disabled="formDisabled"
              :select-options="keywordOptions.E"
              input-classes="h-16 xl:h-[90px]"
            />
            <InputComponent
              v-model="currentPoemsTemplate.message"
              type="textarea"
              title="訊息 (M)"
              placeholder="模板訊息"
              :disabled="formDisabled"
              input-classes="h-16 xl:h-[90px]"
              :select-options="keywordOptions.M"
            />
            <InputComponent
              v-model="currentPoemsTemplate.service"
              type="textarea"
              title="服務 (S)"
              placeholder="模板服務"
              :disabled="formDisabled"
              input-classes="h-16 xl:h-[90px]"
              :select-options="keywordOptions.S"
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
              @click="stores.poemsTemplate.randomizeContext"
            />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel @search="handleSearch">
      <CardGallery :grid-cols="3">
        <Card
          class="min-h-[150px] xl:min-h-[350px]"
          :active="!activePoemsTemplate"
          @click="() => (activePoemsTemplate = null)"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增模板
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in poemsTemplates.filter((el) =>
            [
              el.title,
              el.persona?.role,
              el.persona?.trait,
              el.object,
              el.environment,
              el.service,
            ].join()
          )"
          :key="el._id"
          class="min-h-[150px] xl:min-h-[350px]"
          :active="activeId === el._id"
          @dblclick="() => handleDblclick()"
          @click="() => (activePoemsTemplate = el)"
        >
          <CardTitle>{{ el.title }}</CardTitle>
          <CardDescription>
            {{
              [
                `P: ${el.persona && `${el.persona.trait}的${el.persona.role}`}`,
                `O: ${el.object}`,
                `E: ${el.environment}`,
                `M: ${el.message}`,
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
import { FormStateKey } from '@/types';

const ActionsComponents: Partial<
  Record<FormStateKey, ConcreteComponent | string>
> = {
  NEW: resolveComponent('PoemsTemplateNewActions'),
  DETAILS: resolveComponent('PoemsTemplateDetailsActions'),
  EDITING: resolveComponent('PoemsTemplateEditingActions'),
} as const;

const formPanelProps = {
  title: 'POEMS 模板',
  description: '第四步將前三步所得之資料組合成一張張的情境故事(poems)',
};

const { username, getTokenSilently } = useAuth();
const stores = {
  modal: useModalStore(),
  persona: usePersonaStore(),
  keyword: useKeywordStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const {
  searchQuery,
  poemsTemplates,
  activePoemsTemplate,
  activeId,
  currentPoemsTemplate,
  state,
  formCardProps,
  formDisabled,
  personaOptions,
  keywordOptions,
} = storeToRefs(stores.poemsTemplate);

const handleDblclick = () => {
  stores.modal.show();
};

const handleSearch = async (value: string) => {
  searchQuery.value = value;

  const token = await getTokenSilently();
  stores.poemsTemplate.update(token);
};

onMounted(async () => {
  let token = await getTokenSilently();
  await Promise.all([stores.persona.init(token), stores.keyword.init(token)]);

  token = await getTokenSilently();
  await stores.poemsTemplate.init(token);
});
</script>
