<template>
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="handleClear"
      class="rounded-lg bg-red-400 px-8 py-3 text-white hover:bg-red-500"
      body="清除"
    />
    <CardButton
      @click.prevent="handleCreate"
      class="rounded-lg bg-indigo-500 px-8 py-3 text-white hover:bg-indigo-600"
      body="新增"
    />
  </div>
</template>

<script setup lang="ts">
import type { User, Persona } from '@/types';
import { NewPersonaSchema } from '@/types';

const { user, getTokenSilently } = useAuth();
const stores = {
  issue: useIssueStore(),
};
const { issueId, currentResources, currentPersona, loading } = storeToRefs(
  stores.issue
);

const handleClear = () => {};

const handleCreate = async () => {
  try {
    loading.value = true;
    console.log(currentPersona.value);
    console.log(currentResources.value.persona);

    // if (!issueId.value) {
    //   throw new Error('issue id undefined');
    // }

    // const token = await getTokenSilently();
    // const i = NewPersonaSchema.parse(currentPersona.value);

    // console.log('Creating: ', i);
    // const { data: createdPersona } = await fetchResource<Persona>(
    //   token,
    //   `/api/issues/${issueId.value}/issues`,
    //   {
    //     method: 'post',
    //     body: i,
    //   }
    // );
    // createdPersona.creator = user.value as User;

    // console.log('Created: ', createdPersona);
    // stores.issue.upsert(createdPersona);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>
