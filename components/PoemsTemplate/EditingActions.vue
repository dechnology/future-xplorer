<template>
  <div class="flex items-center justify-around">
    <CardButton
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      @click.prevent="handleCancel"
    >
      取消
    </CardButton>
    <CardButton
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      @click.prevent="handleSaveEdit"
    >
      儲存
    </CardButton>
  </div>
</template>

<script setup lang="ts">
import isEqual from 'lodash/isEqual';
import type { PoemsTemplate } from '@/types';
import { NewPoemsTemplateSchema } from '@/types';

const { getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  poemsTemplate: usePoemsTemplateStore(),
};
const { currentPoemsTemplate, activePoemsTemplate, activeId, state, loading } =
  storeToRefs(stores.poemsTemplate);

const handleCancel = () => {
  stores.poemsTemplate.resetForm();
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (isEqual(currentPoemsTemplate.value, activePoemsTemplate.value)) {
      state.value = 'DETAILS';
      return;
    }

    if (!currentPoemsTemplate.value.persona) {
      throw new Error('no persona');
    }

    let token = await getTokenSilently();
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
    console.log('Patched: ', editedPoemsTemplate);

    token = await getTokenSilently();
    await stores.poemsTemplate.update(token);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
