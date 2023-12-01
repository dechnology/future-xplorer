<template>
  <NuxtLayout>
    <template #form>
      <FormPanel>
        <template #header>
          <PanelHeader>
            <template #title>{{ formPanelProps.title }}</template>
            <template #description>{{ formPanelProps.description }}</template>
            <template #tooltip>{{ tooltip }}</template>
          </PanelHeader>
        </template>
        <FormCard v-bind="formCardProps">
          <template #body>
            <div class="grid grid-cols-2 gap-2 xl:gap-x-5 xl:gap-y-7">
              <InputComponent
                v-model="currentPersona.role"
                type="text"
                title="角色"
                placeholder="角色名稱"
                :disabled="formDisabled"
                :select-options="
                  PersonaPresets.role.map((el) => ({ name: el, data: el }))
                "
              />
              <InputComponent
                v-model="currentPersona.name"
                type="text"
                title="姓名"
                placeholder="姓名"
                :disabled="formDisabled"
              />
              <InputComponent
                v-model="currentPersona.age"
                type="text"
                title="年齡"
                placeholder="年齡"
                :disabled="formDisabled"
                :select-options="
                  PersonaPresets.age.map((el) => ({ name: el, data: el }))
                "
              />
              <InputComponent
                v-model="currentPersona.gender"
                type="text"
                title="性別"
                placeholder="性別"
                :disabled="formDisabled"
                :select-options="PersonaPresets.gender.map((el) => el)"
                select-only
              />
            </div>
            <InputComponent
              v-model="currentPersona.trait"
              type="textarea"
              title="特徵"
              placeholder="特徵"
              input-classes="h-16 xl:h-32"
              :disabled="formDisabled"
              :select-options="
                PersonaPresets.trait.map((el) => ({ name: el, data: el }))
              "
            />
            <InputComponent
              v-model="currentPersona.other"
              type="textarea"
              title="其他"
              placeholder="其他"
              input-classes="h-16 xl:h-32"
              :disabled="formDisabled"
            />
            <div class="flex flex-col overflow-hidden rounded-lg">
              <Image
                v-model:file="imageFile"
                :url="currentImgaeUrl"
                :disabled="formDisabled"
                :image-state="imageState"
                @blob-url-created="(url) => (imageUrl = url)"
              />
            </div>
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
                @click="() => (currentPersona = getRandomNewPersona())"
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
      <CardGallery>
        <Card
          :active="!activePersona"
          class="h-[200px] xl:h-[350px]"
          @click="() => (activePersona = null)"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增人物
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="p in personas"
          :key="p._id"
          :active="activeId === p._id"
          class="h-[200px] xl:h-[350px]"
          @dblclick="stores.modal.show"
          @click="() => (activePersona = p)"
        >
          <template #image>
            <CardImage :url="p.image" />
          </template>
          <CardDescription classes="text-sm font-medium"
            >{{
              [
                `角色：${p.role}`,
                `姓名：${p.name}`,
                `性別：${p.gender}`,
                `年齡：${p.age}`,
                `特徵：${p.trait}`,
              ].join('\n')
            }}
          </CardDescription>
          <CardFootnote>
            {{ `建立者：${p.creator.name}` }}
          </CardFootnote>
        </Card>
        <!-- Should be async component (end) -->
      </CardGallery>
    </CardGalleryPanel>
  </NuxtLayout>
  <PersonaModal />
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKey } from '~/types';

const formPanelProps = {
  title: '人物清單',
  description: '第二步需決定此情境可能的使用人物會有哪些。',
};
const tooltip = [
  'Case. 如何新增人物？',
  '1. 點擊右側子議題卡牌中左上方的加(+)號卡牌，左側面板將會切換為「新增人物」模式',
  '2. 依序輸入人物的：角色、姓名、年齡、性別、特徵與其他資訊。部分選項有依據TDRI（台灣設計研究院）的研究成果，預先提供了一些重要選項。比較需要注意的是年齡部分輸入描述或實際的歲數都可以接受',
  '3. 當人物輪廓資訊都輸入完畢後，可以上傳人物形象圖。如果沒有事先準備好的人物形象圖，可以透過GAI生成，系統會以人物輪廓資訊為基礎，透過提示詞工程創建',
  '4. 最後按下「新增」按鈕，就會出現在右方的人物卡牌中。',
  '',
  'Case. 如何查看人物資訊？',
  '> 當我們已經有了多個人物時，可以透過兩種方式查看完整議題描述：',
  '1. 控制游標在卡牌中移動，此時所在位置的議題卡牌會以不同顏色呈現。「單擊」人物卡牌，左側面板將會切換為「人物資訊」模式。在左側面板以滾動方式查看完整人物誌。',
  '2. 「雙擊」人物卡牌後，將會出現人物誌展示模式彈跳視窗，方便呈現',
  '',
  'Case. 如何修改人物資訊？',
  '> 當我們想修改某個人物設定時，可以透過以下方式修改：',
  '1. 控制游標在卡牌中移動，此時所在位置的人物卡牌會以不同顏色呈現',
  '2. 「單擊」人物卡牌，左側面板將會切換為「人物資訊」模式',
  '3. 點擊左側面板的「編輯」按鈕，所有欄位將變成可編輯狀態，細節可參考新增人物',
  '4. 按下「取消」按鈕維持原狀態退出，或是按下「儲存」按鈕提交變更',
  '',
  'Case. 如何刪除人物？',
  '> 當我們想刪除某個人物時，可以透過以下方式刪除：',
  '1. 控制游標在卡牌中移動，此時所在位置的人物卡牌會以不同顏色呈現',
  '2. 「單擊」人物卡牌，左側面板將會切換為「人物資訊」模式',
  '3. 點擊左側面板的「刪除」按鈕，系統將會刪除與人物相關的資訊，並進入新增人物模式',
  '',
  'Case. 如何進入下一個流程？',
  '下一步是累積與議題相關的案例，可以直接點擊上方的「案例清單」，開始鍵入',
].join('\n');

const ActionsComponents: Partial<
  Record<FormStateKey, ConcreteComponent | string>
> = {
  NEW: resolveComponent('PersonaNewActions'),
  DETAILS: resolveComponent('PersonaDetailsActions'),
  EDITING: resolveComponent('PersonaEditingActions'),
} as const;

const { getTokenSilently } = useAuth();

const stores = {
  persona: usePersonaStore(),
  modal: useModalStore(),
};

const {
  searchQuery,
  personas,
  currentPersona,
  activePersona,
  activeId,
  imageUrl,
  imageFile,
  state,
  imageState,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.persona);

const currentImgaeUrl = computed(
  () => imageUrl.value || currentPersona.value?.image
);

const handleSearch = async () => {
  const token = await getTokenSilently();
  await stores.persona.update(token);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.persona.init(token);
});
</script>
