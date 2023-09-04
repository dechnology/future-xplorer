<template>
  <CardButton
    @click.prevent="() => handlePortraitGeneration()"
    class="mx-auto h-12 w-44 rounded-lg bg-lime-600 text-white hover:bg-lime-700"
    body="AI生成圖片"
  />
  <div class="flex items-center justify-around">
    <CardButton
      @click.prevent="() => stores.persona.clearCurrentPersona()"
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
  persona: usePersonaStore(),
};
const { workshop, issue, issueId } = storeToRefs(stores.issue);
const { currentPersona, imageFileBuffer, imageUrlBuffer, loading } =
  storeToRefs(stores.persona);

const handlePortraitGeneration = async () => {
  try {
    if (!(workshop.value && issue.value)) {
      throw new Error('no workshop or issue');
    }

    const persona = NewPersonaSchema.parse(currentPersona.value);
    const token = await getTokenSilently();

    console.log('generating portrait for persona: ', persona);
    const { prompt } = await generatePrompt(token, {
      workshop: workshop.value,
      issue: issue.value,
      persona,
    });
    console.log('prompt: ', prompt);

    const { image } = await generateImage(token, { prompt });
    console.log('image: ', image);

    imageFileBuffer.value = null;
    imageUrlBuffer.value = image;
  } catch (e) {
    console.error(e);
  }
};

const handleCreate = async () => {
  try {
    loading.value = true;

    if (!(issueId.value && issue.value)) {
      throw new Error('issue undefined');
    }

    const token = await getTokenSilently();
    const p = NewPersonaSchema.parse(currentPersona.value);

    if (imageUrlBuffer.value) {
      currentPersona.value.image = imageFileBuffer.value
        ? (await uploadImageFile(token, imageFileBuffer.value)).data
        : (await uploadImageUrl(token, imageUrlBuffer.value)).data;
      console.log(`image url: ${currentPersona.value.image}`);
    }

    console.log('Creating: ', p);
    const { data: createdPersona } = await fetchResource<Persona>(
      token,
      `/api/issues/${issueId.value}/personas`,
      {
        method: 'post',
        body: p,
      }
    );
    createdPersona.creator = user.value as User;

    console.log('Created: ', createdPersona);
    issue.value.personas.push(createdPersona);
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};
</script>