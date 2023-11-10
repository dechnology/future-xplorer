<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 text-white hover:bg-red-500"
      @click.prevent="() => stores.poemsTemplate.resetForm()"
    >
      清除
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
      @click.prevent="handleCreate"
    >
      新增
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import type { PoemsTemplate } from '@/types';
import { NewPoemsTemplateSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { issueId } = storeToRefs(stores.issue);
const { currentPoemsTemplate, loading } = storeToRefs(stores.poemsTemplate);

const handleCreate = async () => {
  try {
    loading.value = true;

    currentPoemsTemplate.value = {
      title: '預設模板標題',
      ...stores.poemsTemplate.getRandomContext(),
      ...Object.fromEntries(
        Object.entries(currentPoemsTemplate.value).filter(([k, v]) => v)
      ),
    };

    if (!currentPoemsTemplate.value.persona) {
      throw new Error('no persona');
    }

    const el = NewPoemsTemplateSchema.passthrough().parse(
      currentPoemsTemplate.value
    );

    console.log('Creating: ', el);
    let token = await getTokenSilently();
    const { data: createdPoemsTemplate } = await fetchResource<PoemsTemplate>(
      token,
      `/api/issues/${issueId.value}/poemsTemplates`,
      {
        method: 'post',
        body: { ...el, persona: currentPoemsTemplate.value.persona?._id },
      }
    );
    console.log('Created: ', createdPoemsTemplate);

    token = await getTokenSilently();
    await stores.poemsTemplate.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
