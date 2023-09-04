<template>
  <CardButton
    @click.prevent="() => handlePortraitGeneration()"
    class="mx-auto h-12 w-44 rounded-lg bg-lime-600 text-white hover:bg-lime-700"
    body="AI生成圖片"
  />
  <div class="flex items-center justify-around">
    <CardButton
      @click="handleCancel"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="取消"
    />
    <CardButton
      @click="handleSaveEdit"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="儲存"
    />
  </div>
</template>

<script setup lang="ts">
import type { User, Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
  persona: usePersonaStore(),
};
const { workshop, issue } = storeToRefs(stores.issue);
const { currentPersona, activePersona, activeId, state, loading } = storeToRefs(
  stores.persona
);

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const token = await getTokenSilently();
    await stores.persona.generatePortrait(token, {
      workshop: workshop.value,
      issue: issue.value,
    });
  } catch (e) {
    console.error(e);
  }
};

const handleCancel = () => {
  stores.persona.changeActivePersona(activePersona.value);
};

const handleSaveEdit = async () => {
  try {
    loading.value = true;

    if (_.isEqual(currentPersona.value, activePersona.value)) {
      state.value = 'DETAILS';
      return;
    }

    const token = await getTokenSilently();
    const p = NewPersonaSchema.parse(currentPersona.value);

    console.log('Patching: ', p);
    const { data: editedPersona } = await fetchResource<Persona>(
      token,
      `/api/issues/${activeId.value}`,
      { method: 'put', body: p }
    );

    editedPersona.creator = user.value as User;
    console.log('Patched: ', editedPersona);
    activePersona.value = editedPersona;
    stores.persona.changeActivePersona(editedPersona);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
