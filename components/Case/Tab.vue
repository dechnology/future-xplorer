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
        <FormCard v-bind="formCardProps">
          <template #body>
            <InputComponent
              v-model="currentCase.title"
              type="text"
              title="標題"
              placeholder="案例標題"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.background"
              type="textarea"
              title="背景介紹"
              placeholder="案例背景"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.method"
              type="textarea"
              title="作法"
              placeholder="案例作法"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.goal"
              type="textarea"
              title="目標"
              placeholder="案例目標"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.challenge"
              type="textarea"
              title="問題與挑戰"
              placeholder="案例的問題與挑戰"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.result"
              type="textarea"
              title="成果"
              placeholder="案例成果"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.reference"
              type="textarea"
              title="參考資料"
              placeholder="案例參考資料"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />
            <InputComponent
              v-model="currentCase.other"
              type="textarea"
              title="其他"
              placeholder="案例其他"
              input-classes="h-[100px]"
              :disabled="formDisabled"
            />

            <div class="flex flex-col overflow-hidden rounded-lg">
              <Image
                v-model:file="imageFile"
                :url="imgaeUrl"
                :disabled="formDisabled"
                :image-state="imageState"
                @blob-url-created="(url) => (imageUrl = url)"
              />
            </div>
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions> </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel @search="handleSearch">
      <CardGallery>
        <Card
          :active="!activeCase"
          class="h-[350px]"
          @click="() => (activeCase = null)"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增案例
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in cases"
          :key="el._id"
          :active="activeId === el._id"
          class="h-[350px]"
          @dblclick="() => stores.modal.show()"
          @click="() => (activeCase = el)"
        >
          <template #image>
            <CardImage :url="el.image" />
          </template>
          <CardDescription
            input-classes="text-zinc-800 text-sm font-medium leading-snug"
          >
            {{
              [
                `標題：${el.title}`,
                `目標：${el.goal}`,
                `作法：${el.method}`,
              ].join('\n')
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
  <CaseModal />
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKey } from '~/types';

const formPanelProps = {
  title: '案例列表',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const ActionsComponents: Partial<
  Record<FormStateKey, ConcreteComponent | string>
> = {
  NEW: resolveComponent('CaseNewActions'),
  DETAILS: resolveComponent('CaseDetailsActions'),
  EDITING: resolveComponent('CaseEditingActions'),
} as const;

const { getTokenSilently } = useAuth();

const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};

const {
  searchQuery,
  cases,
  currentCase,
  activeCase,
  activeId,
  state,
  imageState,
  imageUrl,
  imageFile,
  formDisabled,
  formCardProps,
  showNewKeywordBtn,
  keywordInput,
} = storeToRefs(stores.case);

const imgaeUrl = computed(() => imageUrl.value || activeCase.value?.image);

const handleSearch = async (value: string) => {
  searchQuery.value = value;
  const token = await getTokenSilently();
  await stores.case.update(token);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.case.update(token);
});
</script>
