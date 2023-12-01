<template>
  <NuxtLayout left-basis="40%" right-basis="60%">
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
            <template #tooltip>{{ tooltip }}</template>
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
            <ClientOnly>
              <!-- <Icon
                v-if="state !== 'DETAILS'"
                class="cursor-pointer text-blue-950"
                name="game-icons:rolling-dices"
                size="1.75rem"
                @click="stores.poemsTemplate.randomizeContext"
              /> -->
              <Icon
                v-if="state == 'DETAILS'"
                class="cursor-pointer text-blue-950"
                name="material-symbols:open-in-full-rounded"
                size="1.75rem"
                @click="stores.modal.show"
              />
            </ClientOnly>
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <InputSearchBar v-model="searchQuery" @search="handleSearch" />
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
          v-for="el in poemsTemplates"
          :key="el._id"
          class="max-h-[200px] min-h-[150px] xl:max-h-[400px] xl:min-h-[350px]"
          :active="activeId === el._id"
          @dblclick="stores.modal.show"
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
    <PoemsTemplateModal />
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
const tooltip = [
  'Case. 如何新增模板？',
  '1. 點擊右側模板卡牌中左上方的加(+)號卡牌，左側面板將會切換為「新增POEMS模板」模式',
  '2. 依序輸入模板的：標題、使用者(P)、物件(O)、環境(E)、訊息(M)、服務(S)。選項來自於之前小組成員的投票結果。如果發現關鍵字不足，或是某些分類沒有關鍵字，可以隨時回到前面的步驟進行擴增',
  '3. 最後按下「新增」按鈕，就會出現在右方的模板卡牌中。',
  '',
  'Case. 如何查看模板資訊？',
  '當我們已經有了多個模板時，可以透過兩種方式查看完整議題描述：',
  '1. 控制游標在卡牌中移動，此時所在位置的模板卡牌會以不同顏色呈現。「單擊」模板卡牌，左側面板將會切換為「POEMS模板資訊」模式。在左側面板以滾動方式查看完整模板組合。',
  '2. 「雙擊」模板卡牌後，將會出現模板展示模式彈跳視窗，方便呈現',
  '',
  'Case. 如何修改模板資訊？',
  '當我們想修改某個模板組合時，可以透過以下方式修改：',
  '1. 控制游標在卡牌中移動，此時所在位置的模板卡牌會以不同顏色呈現',
  '2. 「單擊」模板卡牌，左側面板將會切換為「POEMS模板資訊」模式',
  '3. 點擊左側面板的「編輯」按鈕，所有欄位將變成可編輯狀態，細節可參考新增模板',
  '4. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何刪除模板？',
  '當我們想刪除某個模板時，可以透過以下方式刪除：',
  '1. 控制游標在卡牌中移動，此時所在位置的模板卡牌會以不同顏色呈現',
  '2. 「單擊」模板卡牌，左側面板將會切換為「POEMS模板資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與模板相關的資訊，並進入新增模板模式',
  '',
  'Case. 如何進入下一個流程？',
  '下一步是使用此模板進行情境故事的細節設計，可以直接點擊上方的「情境故事」，開始鍵入',
].join('\n');

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

const handleSearch = async () => {
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
