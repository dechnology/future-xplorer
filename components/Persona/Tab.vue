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
          <template #icon-actions>
            <ClientOnly>
              <Icon
                v-if="state !== 'DETAILS'"
                class="cursor-pointer text-blue-950"
                name="game-icons:rolling-dices"
                size="1.75rem"
                @click="() => (currentPersona = getRandomNewPersona())"
              />
              <Icon
                v-if="state == 'DETAILS'"
                class="cursor-pointer text-blue-950"
                name="material-symbols:open-in-full-rounded"
                size="1.75rem"
                @click="() => openModel()"
              />
            </ClientOnly>
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel @search="handleSearch">
      <CardGallery>
        <Card
          :active="!activePersona"
          class="h-[350px]"
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
          class="h-[350px]"
          @dblclick="() => openModel()"
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
  <PersonaModal v-if="activePersona">
    <PersonaModalAvatar :current-persona-image="activePersona.image" />
    <template #personaInfo>
      <PersonaModalContent v-slot="slotProps">
        <div
          v-for="(content, title) in slotProps.content"
          :key="`${content}_${title}`"
        >
          <p
            class="font-['Roboto'] text-2xl font-bold leading-10 text-neutral-600"
          >
            <span class="font-semibold">{{ title }}：</span>
            <span>{{ content }}</span>
          </p>
        </div>
      </PersonaModalContent>
    </template>
    <template #actions>
      <PersonaModalActions />
      <PersonaModalFootnote>
        <p>
          <span class="font-regular text-base text-gray-400">
            <br />{{ `建立者：${activePersona.creator.name}` }} <br />{{
              `新增時間：${format(activePersona.createdAt, 'yyyy-MM-dd')}`
            }}
            <br />{{
              `更新時間：${format(activePersona.updatedAt, 'yyyy-MM-dd')}`
            }}
          </span>
        </p>
      </PersonaModalFootnote>
    </template>
  </PersonaModal>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import type { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import type { FormStateKey } from '~/types';

const formPanelProps = {
  title: '人物清單',
  description: '第二步需決定此情境可能的使用人物會有哪些。',
};

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

const imgaeUrl = computed(() => imageUrl.value || activePersona.value?.image);

const openModel = () => {
  stores.modal.show();
};
const handleSearch = async (value: string) => {
  searchQuery.value = value;

  const token = await getTokenSilently();
  await stores.persona.update(token);
};

onMounted(async () => {
  const token = await getTokenSilently();
  await stores.persona.init(token);
});
</script>
