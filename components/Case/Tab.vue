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
        <FormCard v-bind="formCardProps" :username="username">
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
              <NuxtImg
                v-if="currentCase.image"
                :src="currentCase.image"
                alt="案例圖遺失"
              />
              <NuxtImg
                v-else-if="imageUrlBuffer"
                :src="imageUrlBuffer"
                alt="新圖遺失"
              />
              <InputFileDropzone
                v-else
                v-model:file="imageFileBuffer"
                :disabled="formDisabled"
                class="h-72 shrink-0 grow"
                @blob-url-created="(url) => (imageUrlBuffer = url)"
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
    <CardGalleryPanel v-slot="slopProps">
      <CardGallery>
        <Card
          :active="!activeCase"
          class="h-[350px]"
          @click="() => stores.case.changeActiveCase()"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增案例
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="el in cases.filter((el) =>
            [
              el.title,
              el.background,
              el.method,
              el.goal,
              el.challenge,
              el.other,
            ]
              .join()
              .includes(slopProps.searchQuery)
          )"
          :key="el._id"
          :active="activeId === el._id"
          class="h-[350px]"
          @dblclick="() => handleDblclick()"
          @click="() => stores.case.changeActiveCase(el)"
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
    <CaseModalContent v-slot="slotProps">
      <div
        v-for="(content, title) in slotProps.content"
        :key="`${content}_${title}`"
      >
        <p>
          <span class="text-base font-semibold text-gray-700">
            {{ title }}：
          </span>
          <span>
            {{ content }}
          </span>
        </p>
      </div>
    </CaseModalContent>
    <CaseModalActions />
    <template #keywords>
      <KeywordGalleryPanel v-slot="slotProps" :include-search-bar="true">
        <KeywordGallery :grid-cols="2">
          <KeywordCard
            v-for="(el, idx) in currentKeywords.filter((el) =>
              el.body.includes(slotProps.searchQuery)
            )"
            :key="`${idx}_${el.body}`"
            class="h-28"
            @update:keyword="(body) => updateKeyword({ ...el, body })"
          >
            <template #category>
              <span v-if="'category' in el && el.category">
                {{ el.category }}
              </span>
            </template>
            {{ el.body }}
            <template #removeIcon>
              <Icon
                name="mdi:bin"
                size="20px"
                class="cursor-pointer text-red-400 transition-all hover:text-red-600"
                @click="() => removeKeyword(el)"
              />
            </template>
          </KeywordCard>
        </KeywordGallery>
      </KeywordGalleryPanel>
    </template>
  </CaseModal>
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys, Keyword } from '~/types';

const formPanelProps = {
  title: '案例列表',
  description:
    '第三步需自行在網路平台查詢收集可能的產品與服務案例資料，彙整成獨立的牌卡。',
};

const ActionsComponents: Partial<
  Record<FormStateKeys, ConcreteComponent | string>
> = {
  NEW: resolveComponent('CaseNewActions'),
  DETAILS: resolveComponent('CaseDetailsActions'),
  EDITING: resolveComponent('CaseEditingActions'),
} as const;

const { username, getTokenSilently } = useAuth();
const stores = {
  case: useCaseStore(),
  modal: useModalStore(),
};

const {
  cases,
  currentCase,
  activeCase,
  activeId,
  imageUrlBuffer,
  imageFileBuffer,
  currentKeywords,
  state,
  loading,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.case);

const { ignoreNextClose } = storeToRefs(stores.modal);

const handleDblclick = () => {
  stores.modal.show();
};

const removeKeyword = async (kw: Keyword) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;
    const token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'delete',
      }
    );
    console.log('Deleted: ', data);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const updateKeyword = async (kw: Keyword) => {
  ignoreNextClose.value = true;

  try {
    loading.value = true;
    const token = await getTokenSilently();
    const { data } = await fetchResource<Keyword>(
      token,
      `/api/keywords/${kw._id}`,
      {
        method: 'put',
        body: kw,
      }
    );
    console.log('Updated: ', data);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
