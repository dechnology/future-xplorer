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
            <div class="grid grid-cols-2 gap-x-5 gap-y-7">
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
                :select-options="
                  PersonaPresets.gender.map((el) => ({ name: el, data: el }))
                "
                select-only
              />
            </div>
            <InputComponent
              v-model="currentPersona.trait"
              type="textarea"
              title="特徵"
              placeholder="特徵"
              input-classes="h-32"
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
              input-classes="h-32"
              :disabled="formDisabled"
            />
            <div class="flex flex-col overflow-hidden rounded-lg">
              <NuxtImg
                v-if="currentPersona.image"
                :src="currentPersona.image"
                placeholder="https://api.iconify.design/line-md:loading-alt-loop.svg"
                alt=""
              />
              <NuxtImg
                v-else-if="imageUrlBuffer"
                :src="imageUrlBuffer"
                placeholder="https://api.iconify.design/line-md:loading-alt-loop.svg"
                alt="人物圖遺失"
              />
              <InputFileDropzone
                v-else
                v-model:file="imageFileBuffer"
                class="h-72 shrink-0 grow"
                :disabled="formDisabled"
                :status="imgStatus"
                @blob-url-created="(url) => (imageUrlBuffer = url)"
              />
            </div>
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
              @click="() => (currentPersona = getRandomNewPersona())"
            />
            <Icon
              v-else
              @click="openModel"
              class="cursor-pointer text-blue-950"
              name="material-symbols:open-in-full-rounded"
              size="1.75rem"
            />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery>
        <Card
          :active="!activePersona"
          class="h-[350px]"
          @click="() => stores.persona.changeActivePersona()"
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
          class="h-[350px]"
          @dblclick="() => openModel()"
          @click="() => stores.persona.changeActivePersona(p)"
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
  <PersonaModal v-if="activePersona">
    <PersonaModalAvatar
      :currentPersonaImage="activePersona.image"
    />
    <template #personaInfo>
      <PersonaModalContent v-slot="slotProps">
        <div v-for="(content, title) in slotProps.content">
          <p>
            <span class="text-base font-semibold text-gray-700 text-3xl"
              >{{ title }}：</span
            >
            <span class="text-3xl">
              {{ content }}
            </span>
          </p>
        </div>
      </PersonaModalContent>
    </template>
    <template #actions>
      <PersonaModalActions />
      <PersonaModalFootnote>
        <p>
          <span class="text-base font-regular text-gray-400">
            <br/>{{ `建立者：${activePersona.creator.name}` }}
            <br/>{{ `新增時間：${format(activePersona.createdAt, 'yyyy-MM-dd')}` }}
            <br/>{{ `更新時間：${format(activePersona.updatedAt, 'yyyy-MM-dd')}` }}
          </span>
        </p>
      </PersonaModalFootnote>
    </template>
  </PersonaModal>
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys } from '~/types';
import { format } from 'date-fns';

const formPanelProps = {
  title: '人物清單',
  description: '第二步需決定此情境可能的使用人物會有哪些。',
};

const ActionsComponents: Record<FormStateKeys, ConcreteComponent | string> = {
  NEW: resolveComponent('PersonaNewActions'),
  DETAILS: resolveComponent('PersonaDetailsActions'),
  EDITING: resolveComponent('PersonaEditingActions'),
} as const;

const { username } = useAuth();
const stores = {
  persona: usePersonaStore(),
  modal: useModalStore(),
};

const {
  personas,
  currentPersona,
  activePersona,
  activeId,
  imageUrlBuffer,
  imageFileBuffer,
  state,
  formDisabled,
  formCardProps,
  imgStatus,
} = storeToRefs(stores.persona);

const openModel = () => {
  stores.modal.show();
};
</script>
