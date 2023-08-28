<template>
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
    <!-- <NuxtImg v-if="imageUrlBuffer" :src="imageUrlBuffer" alt="" />
      <InputFileDropzone
        v-else
        @blob-url-created="handleBlobUrlChange"
        class="h-72 shrink-0 grow"
        v-model:file="imageFileBuffer"
        :disabled="formDisabled"
        :active-icon="{
          name: 'material-symbols:add-photo-alternate',
          size: '5rem',
        }"
        :disabled-icon="{ name: 'mdi:image', size: '5rem' }"
      /> -->
  </div>
</template>

<script setup lang="ts">
import { Workshop } from '@/types';

const ActionComponents = {
  NEW: resolveComponent('WorkshopNewAction'),
  DETAILS: resolveComponent('WorkshopDetailsAction'),
  EDITING: resolveComponent('WorkshopEditingAction'),
} as const;

const formPanelProps = {
  panelTitle: '人物清單',
  panelDescription: '第二步需決定此情境可能的使用人物會有哪些。',
};

const { username, getTokenSilently } = useAuth();
const router = useRouter();

const stores = {
  issue: useIssueStore(),
  breadcrumbs: useBreadcrumbsStore(),
};
const {
  currentPersona,
  imageFileBuffer,
  imageUrlBuffer,
  state,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.issue);

const handleDblclick = (id: string) => {
  // TODO: open modal
};
</script>
