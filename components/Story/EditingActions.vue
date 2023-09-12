<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleCancel"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="取消"
    />
    <CardButton
      @click.prevent="handleSaveEdit"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="儲存"
    />
  </div>
</template>

<script setup lang="ts">
// import { isEqual } from 'lodash';
import type { User, PoemsTemplate } from '@/types';
import { NewPoemsTemplateSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { currentPoemsTemplate, activePoemsTemplate, activeId, state, loading } =
  storeToRefs(stores.poemsTemplate);

const handleCancel = () => {
  stores.poemsTemplate.changeActivePoemsTemplate(activePoemsTemplate.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    // if (isEqual(currentPoemsTemplate.value, activePoemsTemplate.value)) {
    //   state.value = 'DETAILS';
    //   return;
    // }

    const token = await getTokenSilently();
    const p = NewPoemsTemplateSchema.passthrough().parse(
      currentPoemsTemplate.value
    );

    console.log('Patching: ', p);
    const { data: editedPoemsTemplate } = await fetchResource<PoemsTemplate>(
      token,
      `/api/poemsTemplates/${activeId.value}`,
      {
        method: 'put',
        body: { ...p, persona: currentPoemsTemplate.value.persona._id },
      }
    );

    editedPoemsTemplate.creator = user.value as User;
    editedPoemsTemplate.persona = currentPoemsTemplate.value.persona;
    console.log('Patched: ', editedPoemsTemplate);
    stores.poemsTemplate.upsertPoemsTemplate(editedPoemsTemplate);
    stores.poemsTemplate.changeActivePoemsTemplate(editedPoemsTemplate);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
