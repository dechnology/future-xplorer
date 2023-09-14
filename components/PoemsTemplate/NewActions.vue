<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="清除"
      @click.prevent="() => stores.poemsTemplate.clearCurrentPoemsTemplate()"
    />
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="新增"
      @click.prevent="handleCreate"
    />
  </div>
</template>

<script setup lang="ts">
import type { User, PoemsTemplate } from '@/types';
import { NewPoemsTemplateSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { issueId } = storeToRefs(stores.issue);
const { currentPoemsTemplate, loading } = storeToRefs(stores.poemsTemplate);

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!currentPoemsTemplate.value.persona) {
      throw new Error('no persona');
    }

    console.log(currentPoemsTemplate.value);

    const token = await getTokenSilently();
    const p = NewPoemsTemplateSchema.passthrough().parse(
      currentPoemsTemplate.value
    );

    console.log('Creating: ', p);
    const { data: createdPoemsTemplate } = await fetchResource<PoemsTemplate>(
      token,
      `/api/issues/${issueId.value}/poemsTemplates`,
      {
        method: 'post',
        body: { ...p, persona: currentPoemsTemplate.value.persona._id },
      }
    );

    createdPoemsTemplate.creator = user.value as User;
    createdPoemsTemplate.persona = currentPoemsTemplate.value.persona;

    console.log('Created: ', createdPoemsTemplate);
    stores.poemsTemplate.upsertPoemsTemplate(createdPoemsTemplate);
    stores.poemsTemplate.changeActivePoemsTemplate(createdPoemsTemplate);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
