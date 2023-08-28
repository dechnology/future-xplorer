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
          </template>
          <template #action>
            <component :is="Actions[state]" />
          </template>
        </FormCard>
      </FormPanel>
    </template>
    <CardGalleryPanel>
      <CardGallery>
        <Card
          :active="!activePersona"
          @click="handleNewCardClick"
          class="h-[350px]"
        >
          <CardIcon :icon="{ name: 'mdi:plus', size: '5rem' }">
            新增議題
          </CardIcon>
        </Card>
        <!-- Should be async component -->
        <Card
          v-for="p in personas"
          :active="activePersona?._id === p._id"
          @dblclick="() => handleDblclick()"
          @click="() => handleCardClick(p._id)"
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

const Actions: Record<FormStateKeys, ConcreteComponent | string> = {
  NEW: resolveComponent('PersonaNewAction'),
  DETAILS: resolveComponent('PersonaDetailsAction'),
  EDITING: resolveComponent('PersonaEditingAction'),
} as const;

const { username } = useAuth();
const stores = {
  issue: useIssueStore(),
  breadcrumbs: useBreadcrumbsStore(),
};

const {
  currentResources,
  activeIds,
  state,
  formDisabled,
  formPanelProps,
  formCardProps,
  personas,
  currentPersona,
  activePersona,
} = storeToRefs(stores.issue);

const handleNewCardClick = () => {
  currentResources.value.persona = getNewPersona();
  state.value = 'NEW';
};

const handleCardClick = (id: string) => {
  activeIds.value.persona = id;
  if (!activePersona.value) {
    console.error('no active persona');
    return;
  }

  currentResources.value.persona = { ...activePersona.value };
  state.value = 'DETAILS';
};

const handleDblclick = () => {};
</script>
