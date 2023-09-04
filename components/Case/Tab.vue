<template>
  <NuxtLayout>
    <template #form>
      <FormPanel v-bind="formPanelProps">
        <FormCard v-bind="formCardProps" :username="username">
          <template #body>
            <InputComponent
              type="text"
              title="標題"
              placeholder="案例標題"
              :disabled="formDisabled"
              v-model="currentCase.title"
            />
            <InputComponent
              type="textarea"
              title="背景介紹"
              placeholder="案例背景"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.background"
            />
            <InputComponent
              type="textarea"
              title="做法"
              placeholder="案例做法"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.method"
            />
            <InputComponent
              type="textarea"
              title="目標"
              placeholder="案例目標"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.goal"
            />
            <InputComponent
              type="textarea"
              title="問題與挑戰"
              placeholder="案例的問題與挑戰"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.challenge"
            />
            <InputComponent
              type="textarea"
              title="成果"
              placeholder="案例成果"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.result"
            />
            <InputComponent
              type="textarea"
              title="參考資料"
              placeholder="案例參考資料"
              input-classes="h-[100px]"
              :disabled="formDisabled"
              v-model="currentCase.reference"
            />

            <div class="flex flex-col overflow-hidden rounded-lg">
              <NuxtImg
                v-if="currentCase.image"
                :src="currentCase.image"
                alt=""
              />
              <NuxtImg
                v-else-if="imageUrlBuffer"
                :src="imageUrlBuffer"
                alt=""
              />
              <InputFileDropzone
                v-else
                @blob-url-created="() => {}"
                class="h-72 shrink-0 grow"
                v-model:file="imageFileBuffer"
                :disabled="formDisabled"
                :active-icon="{
                  name: 'material-symbols:add-photo-alternate',
                  size: '5rem',
                }"
                :disabled-icon="{ name: 'mdi:image', size: '5rem' }"
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
    <CardGalleryPanel>
      <CardGallery>
        <Card
          :active="!activeCase"
          @click="() => stores.case.changeActiveCase()"
          class="h-[350px]"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增案例
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in cases"
          :active="activeId === el._id"
          @dblclick="() => handleDblclick()"
          @click="() => stores.case.changeActiveCase(el)"
          class="h-[350px]"
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
  <CaseModal v-if="activeCase">
    <CardHeader
      :title="activeCase.title"
      :creator-name="activeCase.creator.name"
    />
    <CaseModalActions />
    <template #keywords> kw </template>
  </CaseModal>
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys } from '~/types';

const formPanelProps = {
  title: '案例列表',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const ActionsComponents: Record<FormStateKeys, ConcreteComponent | string> = {
  NEW: resolveComponent('CaseNewActions'),
  DETAILS: resolveComponent('CaseDetailsActions'),
  EDITING: resolveComponent('CaseEditingActions'),
} as const;

const { username } = useAuth();
const stores = {
  issue: useIssueStore(),
  case: useCaseStore(),
};

const { cases } = storeToRefs(stores.issue);
const {
  currentCase,
  activeCase,
  activeId,
  imageUrlBuffer,
  imageFileBuffer,
  state,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.case);

const handleDblclick = () => {
  // TODO open modal
};
</script>