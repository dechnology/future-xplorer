<template>
  <NuxtLayout>
    <template #form>
      <FormPanel v-bind="formPanelProps">
        <FormCard v-bind="formCardProps" :username="username">
          <template #body>
            <div class="grid grid-cols-2 gap-x-5 gap-y-7 rounded-lg">
              <InputComponent
                type="text"
                title="角色"
                placeholder="角色名稱"
                :disabled="formDisabled"
                :select-options="[...PersonaPresets.role]"
                v-model="currentPersona.role"
              />
              <InputComponent
                type="text"
                title="姓名"
                placeholder="姓名"
                :disabled="formDisabled"
                v-model="currentPersona.name"
              />
              <InputComponent
                type="text"
                title="年齡"
                placeholder="年齡"
                :disabled="formDisabled"
                :select-options="[...PersonaPresets.age]"
                v-model="currentPersona.age"
              />
              <InputComponent
                type="text"
                title="性別"
                placeholder="性別"
                :disabled="formDisabled"
                :select-options="[...PersonaPresets.gender]"
                v-model="currentPersona.gender"
                select-only
              />
            </div>
            <InputComponent
              type="textarea"
              title="特徵"
              placeholder="特徵"
              input-classes="h-32"
              :disabled="formDisabled"
              :select-options="[...PersonaPresets.trait]"
              v-model="currentPersona.trait"
            />
            <InputComponent
              type="textarea"
              title="其他"
              placeholder="其他"
              input-classes="h-32"
              :disabled="formDisabled"
              v-model="currentPersona.other"
            />
            <div class="flex flex-col overflow-hidden rounded-lg">
              <NuxtImg
                v-if="currentPersona.image"
                :src="currentPersona.image"
                alt=""
              />
              <NuxtImg
                v-else-if="imageUrlBuffer"
                :src="imageUrlBuffer"
                alt=""
              />
              <InputFileDropzone
                v-else
                @blob-url-created="(url) => (imageUrlBuffer = url)"
                class="h-72 shrink-0 grow"
                v-model:file="imageFileBuffer"
                :disabled="formDisabled"
              />
            </div>
          </template>
          <template #actions>
            <component :is="ActionsComponents[state]" />
          </template>
          <template #icon-actions>
            <Icon
              v-if="state !== 'DETAILS'"
              @click="() => (currentPersona = getRandomNewPersona())"
              class="cursor-pointer text-blue-950"
              name="game-icons:rolling-dices"
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
          @click="() => stores.persona.changeActivePersona()"
          class="h-[350px]"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增人物
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="p in personas"
          :active="activeId === p._id"
          @dblclick="() => handleDblclick()"
          @click="() => stores.persona.changeActivePersona(p)"
          class="h-[350px]"
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
</template>

<script setup lang="ts">
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKeys } from '~/types';

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
  issue: useIssueStore(),
  persona: usePersonaStore(),
};

const { personas } = storeToRefs(stores.issue);
const {
  currentPersona,
  activePersona,
  activeId,
  imageUrlBuffer,
  imageFileBuffer,
  state,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.persona);

const handleDblclick = () => {
  // TODO open modal
};
</script>
