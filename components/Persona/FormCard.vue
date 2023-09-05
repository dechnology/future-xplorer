<template>
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
</template>

<script setup lang="ts">
import { ConcreteComponent } from 'nuxt/dist/app/compat/capi';
import { FormStateKeys, IssueTabKeys } from '~/types';

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
  currentPersona,
  imageFileBuffer,
  imageUrlBuffer,
  state,
  formDisabled,
  formCardProps,
} = storeToRefs(stores.issue);
</script>
